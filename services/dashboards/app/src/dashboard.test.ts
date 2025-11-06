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
	await app.dbStats.exec('DELETE FROM account');
});

describe('POST /internal/dashboard/games', () => {

	it('should return 201 if a game is created', async() => {

	});

	//How do we simulate this tho ?
	it('should return 500 if they is a problem with the database', async() => {

	});
});

describe('PATCH /internal/dashboard/games/:gameID', () => {

	it('should return 200 if stats are patches properly', async() => {

	});

	it('should return 400 if no field are provided for update', async() => {

	});

	it('should return 404 if the game to update was not found', async() => {

	});
});

describe('GET /internal/dashboard/games', () => {
	
	it('should return 200 and empty array if user did not play', async() => {

	});

	it('should return 400 if no userID provided', async() => {

	});

	it('should return 200 and filled array if user played games', async() => {

	});

});

describe('DELETE /internal/dashboard/games/:gameID', () => {

	it('should return 204 if game deleted properly', async() => {

	});

	it('should return 404 if game was not fount', async() => {

	});

});

describe('POST /internal/dashboard/tournaments', () => {

	it('should return 400 if userIDs are not provided correctly', async() => {

	});

	//How do we simulate this tho ?
	it('should return 500 if error with database', async() => {

	});

	it('should return 201 if tournament created properly', async() => {

	});

});

describe('PATCH /internal/dashboard/tournaments/:tournamentID', () => {

	it('should return 400 if winnerID not provided properly', async() => {

	});

	it('should return 404 if tournament not found', async() => {

	});

	it('should return 200 if tournament stats were patch properly', async() => {

	});
});

describe('/internal/dashboard/tournaments/:tournamentID', () => {

	it('should return 204 if tournament was deleted properly', async() => {

	});

	it('should return 404 if tournament was not found', async() => {

	});

});
