import type { FastifyInstance } from 'fastify';
import { buildServer } from './app.js';

// We declare 'app' here so we can access it in all test blocks
let app: FastifyInstance;

// 'beforeAll' runs once, before any tests start
beforeAll(async () => {
	app = await buildServer();
});

// 'afterAll' runs once, after all tests are finished
afterAll(async () => {
	await app.close();
});

// 'beforeEach' runs before EACH 'it' test block
beforeEach(async () => {
	await app.dbFriends.exec('DELETE FROM friendship');
});

/* afterEach(async () => {
	// Restore any mocks
	jest.restoreAllMocks();
}); */

describe('GET /internal/friends/friendship', () => {
	it('should return 200 and "friend" status for an accepted friendship', async () => {

		await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, true]
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userA=1&userB=2'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.status).toBe('friend');
	});

	it('should return 200 and "pending" status for a pending friendship', async () => {

		await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, false]
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userA=1&userB=2'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.status).toBe('pending');
	});

	it('should return 404 if the friendship between two users was not found', async () => {

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userA=1&userB=2'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('[FRIENDS] Friendship not found');
	});

	it('should return 200 if the friendlist if found for a user', async () => {

		await app.dbFriends.run('INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (1, 2, true)');
		await app.dbFriends.run('INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (3, 1, true)');
		await app.dbFriends.run('INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (1, 4, false)'); // Pending, should be ignored

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userID=1&status=friend'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body).toBeInstanceOf(Array);
		expect(body.length).toBe(2);
	});

	it('should return 200 and an empty array if no friends are found', async () => {

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userID=1&status=friend'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body).toEqual([]);
	});

	it('should return 200 and a pending request list', async () => {

		await app.dbFriends.run('INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (2, 1, false)'); // User 2 sent to 1
		await app.dbFriends.run('INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (1, 3, false)'); // User 1 sent to 3 (ignored)

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships?userID=1&status=pending'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body).toBeInstanceOf(Array);
		expect(body.length).toBe(1);
	});


	it('should return 400 if userID was not provided correctly for a friendlist', async () => {

		const response = await app.inject({
			method: 'GET',
			url: '/internal/friends/friendships'
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('[FRIENDS] Invalid query parameters.');
	});
});

describe('POST /internal/friends/frienship', () => {
	it('should return 409 if the friendship between two users already exists', async () => {

		await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, false]
		);

		const payload = {
			senderID: 1,
			friendID: 2
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/friends/friendship',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(409);
		expect(body.success).toBe(false);
		expect(body.message).toBe('[FRIENDS] Friendship already exists!');
	});

	it('should return 500 if the database INSERT fails to make changes', async () => {

		const dbSpy = jest.spyOn(app.dbFriends, 'run');
		dbSpy.mockResolvedValue({ changes: 0, lastID: 0 } as any);

		const payload = {
			senderID: 1,
			friendID: 2
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/friends/friendship',
			payload: payload
		});

		expect(response.statusCode).toBe(500);
		expect(response.json().message).toBe('Internal Server Error');
	});


	it('should return 201 if the friendship was created', async () => {

		const payload = {
			senderID: 1,
			friendID: 2
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/friends/friendship',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(201);
		expect(body.success).toBe(true);

		const dbEntry = await app.dbFriends.get(
			'SELECT * FROM friendship WHERE userID = ? AND friendID = ?',
			[1, 2]
		);
		expect(dbEntry).toBeDefined();
		expect(dbEntry.statusFriendship).toBe(0);
	});

});

describe('PATCH /internal/friendships/:id', () => {

	it('should return 404 if the friendship was not found', async () => {

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/friendships/999',
			payload: {
				receiverID: 2,
				friendID: 1
			}
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('[FRIENDS] Friendship doesnt exists!');
	});

	it('should return 400 if the friendship could not be accepted', async () => {
		const insertResult = await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, false]
		);
		const friendshipID = insertResult.lastID;

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/friendships/${friendshipID}`,
			payload: {
				receiverID: 3,
				friendID: 1
			}
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('[FRIENDS] Friendship could not be accepted.');
	});

	it('should return 200 if the friendship was accepted', async () => {
		const insertResult = await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, false]
		);
		const friendshipID = insertResult.lastID;

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/friendships/${friendshipID}`,
			payload: {
				receiverID: 2,
				friendID: 1
			}
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('[FRIENDS] Friendship accepted !');

		const dbEntry = await app.dbFriends.get(
			'SELECT * FROM friendship WHERE friendshipID = ?',
			[friendshipID]
		);
		expect(dbEntry.statusFriendship).toBe(1);
	});
});


describe('DELETE /internal/friendships', () => {

	it('should return 404 if the friendship was not found', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/friendships?userA=1&userB=2'
		});

		const body = response.json();
		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('[FRIENDS] Friendship not found.');
	});

	it('should return 204 if the friendship was deleted', async () => {

		await app.dbFriends.run(
			'INSERT INTO friendship (userID, friendID, statusFriendship) VALUES (?, ?, ?)',
			[1, 2, true]
		);

		let friendshipInDb = await app.dbFriends.get('SELECT * FROM friendship WHERE userID = 1');
		expect(friendshipInDb).toBeDefined();

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/friendships?userA=1&userB=2'
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();

		friendshipInDb = await app.dbFriends.get('SELECT * FROM friendship WHERE userID = 1');
		expect(friendshipInDb).toBeUndefined();
	});


});

describe('DELETE /internal/friendships', () => {

	it('should return 204 if all friendships were deleted', async () => {

		await app.dbFriends.run('INSERT INTO friendship (userID, friendID) VALUES (50, 51)');
		await app.dbFriends.run('INSERT INTO friendship (userID, friendID) VALUES (52, 50)');
		await app.dbFriends.run('INSERT INTO friendship (userID, friendID) VALUES (1, 2)');

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/friends/50/friendships'
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();

		const user50Friendships = await app.dbFriends.all(
			'SELECT * FROM friendship WHERE userID = 50 OR friendID = 50'
		);
		expect(user50Friendships.length).toBe(0);

		const otherFriendship = await app.dbFriends.get(
			'SELECT * FROM friendship WHERE userID = 1'
		);
		expect(otherFriendship).toBeDefined();
	});

	it('should return 204 even if the user had no friendships to delete', async () => {

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/friends/999/friendships'
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();
	});
});
