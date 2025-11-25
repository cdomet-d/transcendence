import type { FastifyInstance } from 'fastify';
import { buildServer } from './app.js';

//TODO code the actual tests


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
	await app.dbStats.exec('DELETE FROM games');
	await app.dbStats.run('INSERT INTO tournamentInfo (tournamentID) VALUES (123)');
});

afterEach(async () => {
	// This is crucial to "un-mock" our functions so they work normally
	// for the next test.
	jest.restoreAllMocks();
});

describe('POST /internal/dashboard/games', () => {

	it('should return 201 if a game is created', async() => {
		const newGame = {
			local: true,
			tournamentID: 123
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/games',
			payload: newGame
		});

		const body = response.json();

		expect(response.statusCode).toBe(201);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Game created!');
		expect(body.gameID).toBe(1);

		const gameInDb = await app.dbStats.get(
			'SELECT * FROM games WHERE gameID = ?',
			[body.gameID]
		);
		expect(gameInDb.tournamentID).toBe(123);
		expect(gameInDb.localGame).toBe(1);
	});

	it('should return 500 if the database throws an error', async () => {
		const dbSpy = jest.spyOn(app.dbStats, 'run');

		dbSpy.mockImplementationOnce(() => {
			return Promise.reject(new Error('Test DB Crash'));
		});

		const newGame = {
			local: true,
			tournamentID: 123
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/games',
			payload: newGame
		});

		const body = response.json();
		expect(response.statusCode).toBe(500);
		expect(body.message).toBe('Internal Server Error');
	});

	it('should return 500 if they is a problem with the database', async() => {
		const badGame = {
			local: true,
			tournamentID: 999
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/games',
			payload: badGame
		});

		const body = response.json();
		expect(response.statusCode).toBe(500);
		expect(body.message).toBe('[DASHBOARD] Internal server error during game creation');
	});
});

describe('PATCH /internal/dashboard/games/:gameID', () => {

	it('should return 200 if stats are patches properly', async() => {
		const insertResponse = await app.dbStats.run(
			'INSERT INTO games (gameStatus, tournamentID, localGame) VALUES (0, 123, 1)'
		);
		const gameID = insertResponse.lastID;

		const updates = {
			gameStatus: 2,
			duration: 300
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/dashboard/games/${gameID}`,
			payload: updates
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Game updated!');

		const gameInDb = await app.dbStats.get(
			'SELECT * FROM games WHERE gameID = ?',
			[gameID]
		);
		expect(gameInDb.gameStatus).toBe(2);
		expect(gameInDb.duration).toBe(300);
	});

	it('should return 400 if no field are provided for update', async() => {
		const insertResponse = await app.dbStats.run(
			'INSERT INTO games (gameStatus, tournamentID, localGame) VALUES (0, 123, 1)'
		);
		const gameID = insertResponse.lastID;

		const invalidPayload = {
			invalidKey: 'someValue',
			anotherBadKey: 123
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/dashboard/games/${gameID}`,
			payload: invalidPayload
		});

		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('No valid fields provided for update.');
	});

	it('should return 404 if the game to update was not found', async() => {
		const updates = {
			gameStatus: 2
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/dashboard/games/999',
			payload: updates
		});

		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('Game not found.');
	});
});

describe('GET /internal/dashboard/games', () => {
	
	it('should return 200 and empty array if user did not play', async() => {
		const insertResponse = await app.dbStats.run(
			'INSERT INTO games (gameStatus, tournamentID, localGame) VALUES (0, 123, 1)'
		);
		const gameID = insertResponse.lastID;

		const updates = {
			gameStatus: 2,
			duration: 300
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/dashboard/games/${gameID}`,
			payload: updates
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Game updated!');

		const gameInDb = await app.dbStats.get(
			'SELECT * FROM games WHERE gameID = ?',
			[gameID]
		);
		expect(gameInDb.gameStatus).toBe(2);
		expect(gameInDb.duration).toBe(300);
	});

	it('should return 400 if no userID provided', async() => {
		const insertResponse = await app.dbStats.run(
			'INSERT INTO games (gameStatus, tournamentID, localGame) VALUES (0, 123, 1)'
		);
		const gameID = insertResponse.lastID;

		const invalidPayload = {
			invalidKey: 'someValue',
			anotherBadKey: 123
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/dashboard/games/${gameID}`,
			payload: invalidPayload
		});

		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('No valid fields provided for update.');
	});

	it('should return 200 and filled array if user played games', async() => {
		const updates = {
			gameStatus: 2
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/dashboard/games/999',
			payload: updates
		});

		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('Game not found.');
	});

});

describe('DELETE /internal/dashboard/games/:gameID', () => {

	it('should return 204 if game deleted properly', async() => {
		const insertResponse = await app.dbStats.run(
			'INSERT INTO games (gameStatus, tournamentID, localGame) VALUES (0, 123, 1)'
		);
		const gameID = insertResponse.lastID;

		let gameInDb = await app.dbStats.get('SELECT * FROM games WHERE gameID = ?', [gameID]);
		expect(gameInDb).toBeDefined();

		const response = await app.inject({
			method: 'DELETE',
			url: `/internal/dashboard/games/${gameID}`
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();

		gameInDb = await app.dbStats.get('SELECT * FROM games WHERE gameID = ?', [gameID]);
		expect(gameInDb).toBeUndefined();
	});

	it('should return 404 if game was not fount', async() => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/dashboard/games/999'
		});

		const body = response.json();
		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('Game not found.');
	});

});

describe('POST /internal/dashboard/tournaments', () => {

	it('should return 400 if userIDs are not provided correctly', async() => {
		const payload = {
			playerIDs: []
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/tournaments',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('[DASHBOARD] Validation error: playerIDs must be a non-empty array of numbers.');
	});

	it('should return 400 if userIDs are not provided correctly (not an array)', async () => {
		const payload = {
			playerIDs: "not an array"
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/tournaments',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('[DASHBOARD] Validation error: playerIDs must be a non-empty array of numbers.');
	});

	it('should return 500 if error with database', async() => {
		const dbSpy = jest.spyOn(app.dbStats, 'run');

		dbSpy.mockImplementationOnce(() => {
			return Promise.reject(new Error('Test DB Crash'));
		});

		const payload = {
			playerIDs: [1, 2, 3, 4]
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/tournaments',
			payload: payload
		});

		const body = response.json();
		expect(response.statusCode).toBe(500);
		expect(body.message).toBe('Internal Server Error');
	});

	it('should return 201 if tournament created properly', async() => {
		const payload = {
			playerIDs: [1, 2, 3, 4]
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/dashboard/tournaments',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(201);
		expect(body.success).toBe(true);
		expect(body.message).toBe('[DASHBOARD] Tournament created!');
		expect(body.tournamentID).toBe(124);

		const tournamentInDb = await app.dbStats.get(
			'SELECT * FROM tournamentInfo WHERE tournamentID = ?',
			[body.tournamentID]
		);
		expect(tournamentInDb).toBeDefined();
		expect(tournamentInDb.playersIDs).toBe(JSON.stringify([1, 2, 3, 4]));
	});

});

describe('PATCH /internal/dashboard/tournaments/:tournamentID', () => {

	it('should return 400 if winnerID not provided properly', async() => {
		const payload = {};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/dashboard/tournaments/123',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.message).toBe('winnerID is required.');
	});

	it('should return 404 if tournament not found', async() => {
		const payload = {
			winnerID: 10
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/dashboard/tournaments/999',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('Tournament not found.');
	});

	it('should return 200 if tournament stats were patch properly', async() => {
		const payload = {
			winnerID: 10
		};

		const response = await app.inject({
			method: 'PATCH',
			url: '/internal/dashboard/tournaments/123',
			payload: payload
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Tournament updated!');

		const tournamentInDb = await app.dbStats.get(
			'SELECT * FROM tournamentInfo WHERE tournamentID = ?',
			[123]
		);
		expect(tournamentInDb.winnerID).toBe(10);
	});
});

describe('DELETE /internal/dashboard/tournaments/:tournamentID', () => {

	it('should return 204 if tournament was deleted properly', async() => {
		let tournamentInDb = await app.dbStats.get('SELECT * FROM tournamentInfo WHERE tournamentID = 123');
		expect(tournamentInDb).toBeDefined();

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/dashboard/tournaments/123'
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy(); 

		tournamentInDb = await app.dbStats.get('SELECT * FROM tournamentInfo WHERE tournamentID = 123');
		expect(tournamentInDb).toBeUndefined();
	});

	it('should return 404 if tournament was not found', async() => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/dashboard/tournaments/999'
		});

		const body = response.json();
		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('Tournament not found.');
	});
});
