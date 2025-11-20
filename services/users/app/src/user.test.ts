/* import type { FastifyInstance } from 'fastify';
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
	// We wipe the tables to ensure each test is isolated
	await app.dbUsers.exec('DELETE FROM userProfile');
	await app.dbUsers.exec('DELETE FROM userStats');
});

afterEach(async () => {
	// Restore any mocks
	jest.restoreAllMocks();
});

//TODO code thez actual tests

describe('GET /internal/users/:userID', () => {

	it('should return 404 when profile not found', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/999'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User profile not found');
	});

	it('should return 200 when profile found', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username, biography, profileColor) VALUES (?, ?, ?, ?)',
			[123, 'testuser', 'This is a test bio.', '#FF0000']
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/123'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.profile.userID).toBe(123);
		expect(body.profile.username).toBe('testuser');
		expect(body.profile.biography).toBe('This is a test bio.');
		expect(body.profile.profileColor).toBe('#FF0000');
	});
});

describe('GET /internal/users', () => {

	it('should return 404 when profile not found', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/users?username=dontexist'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User not found');
	});

	it('should return 400 when username not provided', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/users'
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('A query parameter (e.g., ?username=...) is required.')
	});

	it('should return 200 when profile found', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'findme']
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/users?username=findme'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('user found!');
		expect(body.user.userID).toBe(123);
		expect(body.user.username).toBe('findme')
	});
});

describe('POST /internal/users/profile', () => {

	it('should return 400 when userIDs not provided properly', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/profile',
			payload: { userIDs: [] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('userIDs must be a non-empty array.');
	});

	it('should return 400 when userIDs not provided properly (not an array)', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/profile',
			payload: { userIDs: "this is not an array" }
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('userIDs must be a non-empty array.');
	});

	it('should return 200 and an empty array when no profile was found', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/profile',
			payload: { userIDs: [998, 999] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.profiles).toBeInstanceOf(Array);
		expect(body.profiles.length).toBe(0);
	});

	it('should return 200 when profiles found', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[10, 'user10']
		);
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[20, 'user20']
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/profile',
			payload: { userIDs: [10, 20] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Profiles found!');
		expect(body.profiles).toBeInstanceOf(Array);
		expect(body.profiles.length).toBe(2);
		expect(body.profiles[0].username).toBe('user10');
		expect(body.profiles[1].username).toBe('user20')
	});
});

describe('POST /internal/users/:userID/profile', () => {

	it('should return 409 when profile with username already exists', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'existing_username']
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/456/profile',
			payload: { username: 'existing_username' }
		});
		const body = response.json();

		expect(response.statusCode).toBe(409);
		expect(body.success).toBe(false);
		expect(body.message).toBe('A profile for this user already exists.');
	});

	it('should return 409 when profile with that userID already exists', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'existing_user']
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/123/profile',
			payload: { username: 'new_user_name' }
		});
		const body = response.json();

		expect(response.statusCode).toBe(409);
		expect(body.success).toBe(false);
		expect(body.message).toBe('A profile for this user already exists.');
	});

	it('should return 201 when profile and stats created', async () => {
		const payload = {
			username: 'new_user'
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/123/profile',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(201);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Profile created successfully!');

		const profileInDb = await app.dbUsers.get(
			'SELECT * FROM userProfile WHERE userID = ?',
			[123]
		);
		expect(profileInDb).toBeDefined();
		expect(profileInDb.username).toBe('new_user');

		const statsInDb = await app.dbUsers.get(
			'SELECT * FROM userStats WHERE userID = ?',
			[123]
		);
		expect(statsInDb).toBeDefined();
		expect(statsInDb.totalMatch).toBe(0);
	});
});

describe('PATCH /internal/users/:userID', () => {

	it('should return 400 when not fields for update provided', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'testuser']
		);

		const payload = {
			invalid_key: 'some_value'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/123',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('No valid stat fields provided for update.');
	});

	it('should return 404 when user not found', async () => {
		const payload = {
			username: 'new_username'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/999',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User not found');
	});

	it('should return 200 when user profile updated', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username, biography) VALUES (?, ?, ?)',
			[123, 'old_username', 'old bio']
		);

		const payload = {
			username: 'new_username',
			biography: 'new bio'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/123',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('User profile updated successfully!');

		const userInDb = await app.dbUsers.get('SELECT * FROM userProfile WHERE userID = 123');
		expect(userInDb.username).toBe('new_username');
		expect(userInDb.biography).toBe('new bio');
	});

	it('should return 409 when modify username with already taken username', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'user-one']
		);
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[456, 'user-two-taken']
		);

		const payload = {
			username: 'user-two-taken'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/123',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(409);
		expect(body.success).toBe(false);
		expect(body.message).toBe('This username is already taken.');
	});
});

describe('DELETE /internal/users/:userID', () => {

	it('should return 404 when user not found', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/users/999'
		});

		const body = response.json();
		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User profile/stats not found.');
	});

	it('should return 204 when user profile and stats deleted', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'user-to-delete']
		);
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, totalWins) VALUES (?, ?)',
			[123, 10]
		);

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/users/123'
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();

		const profile = await app.dbUsers.get('SELECT * FROM userProfile WHERE userID = 123');
		expect(profile).toBeUndefined();
		const stats = await app.dbUsers.get('SELECT * FROM userStats WHERE userID = 123');
		expect(stats).toBeUndefined();
	});
});

describe('GET /internal/users/:userID/stats', () => {

	it('should return 404 when user stats not found', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/999/stats'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User profile not found');
	});

	it('should return 200 when user stats found', async () => {
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, totalMatch, totalWins, winStreak) VALUES (?, ?, ?, ?)',
			[123, 10, 5, 2]
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/123/stats'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.userProfile.userID).toBe(123);
		expect(body.userProfile.totalWins).toBe(5);
	});
});

describe('PATCH /internal/users/:userID/stats', () => {

	it('should return 404 when user stats not found', async () => {
		const actions = [
			{ action: 'increment', field: 'totalWins', value: 1 }
		];

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/999/stats',
			payload: actions
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User not found.');
	});

	it('should return 200 if no stats to update', async () => {
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, totalWins) VALUES (?, ?)',
			[123, 5]
		);

		const actions = [
			{ action: 'increment', field: 'invalid_field_name', value: 1 }
		];

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/123/stats',
			payload: actions
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('No stats were updated.');

		const statsInDb = await app.dbUsers.get('SELECT * FROM userStats WHERE userID = 123');
		expect(statsInDb.totalWins).toBe(5);
	});

	it('should return 200 if stats were updated', async () => {
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, totalWins, longuestPass) VALUES (?, ?, ?)',
			[123, 5, 100]
		);

		const actions = [
			{ action: 'increment', field: 'totalWins', value: 1 },
			{ action: 'setIfGreater', field: 'longuestPass', value: 200 }
		];

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/users/123/stats',
			payload: actions
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('User stats updated successfully.');

		const statsInDb = await app.dbUsers.get('SELECT * FROM userStats WHERE userID = 123');
		expect(statsInDb.totalWins).toBe(6);
		expect(statsInDb.longuestPass).toBe(200);
	});
});

describe('GET internal/users/:userID/userData', () => {

	it('should return 404 if user is missing stats', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username) VALUES (?, ?)',
			[123, 'no-stats-user']
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/123/userData'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User data not found.');
	});


	it('should return 404 if user not found', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/999/userData'
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User data not found.');
	});

	it('should return 200 if user found', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username, avatar, biography, profileColor) VALUES (?, ?, ?, ?, ?)',
			[123, 'join-user', 'a.png', 'my bio', '#123456']
		);
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, winStreak) VALUES (?, ?)',
			[123, 5]
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/users/123/userData'
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);

		expect(body.userData.avatar).toBe('a.png');
		expect(body.userData.biography).toBe('my bio');
		expect(body.userData.profileColor).toBe('#123456');
		expect(body.userData.winStreak).toBe(5);
	});
});

describe('POST /internal/users/userDataBatch', () => {
	
	it('should return 200 and a list of users for a valid list of IDs', async () => {
		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username, avatar) VALUES (?, ?, ?)',
			[10, 'user10', 'a.png']
		);
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, winStreak) VALUES (?, ?)',
			[10, 2]
		);

		await app.dbUsers.run(
			'INSERT INTO userProfile (userID, username, avatar) VALUES (?, ?, ?)',
			[20, 'user20', 'b.png']
		);
		await app.dbUsers.run(
			'INSERT INTO userStats (userID, winStreak) VALUES (?, ?)',
			[20, 5]
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/userDataBatch',
			payload: { userIDs: [10, 20] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.usersData).toBeInstanceOf(Array);
		expect(body.usersData.length).toBe(2);
		expect(body.usersData[0].username).toBe('user10');
		expect(body.usersData[1].winStreak).toBe(5);
	});

	it('should return 200 if not user to get', async () => {
		const payload = {
			userIDs: [] 
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/userDataBatch',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body).toEqual([]);
	});

	it('should return 200 if not users found', async () => {
		const payload = {
			userIDs: [998, 999]
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/users/userDataBatch',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.usersData).toBeInstanceOf(Array);
		expect(body.usersData.length).toBe(0);
	});
});
 */