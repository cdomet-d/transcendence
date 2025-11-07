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
	await app.dbAccount.exec('DELETE FROM account');
});

//TODO code thez actual tests

describe('GET /internal/friends/friendship', () => {
	it('should return 200 and the status of friendship if a friendship is found between two users', async () => {

	});

	it('should return 404 if the friendship between two users was not found', async () => {

	});

	it('should return 200 if the friendlist if found for a user', async () => {

	});

	it('should return 404 if the friendship between two users was not found', async () => {

	});

	it('should return 400 if userID was not provided correctly for a friendlist', async () => {

	});
});

desccribe('POST /internal/friends/frienship', () => {
	it('should return 409 if the friendship between two users already exists', async () => {

	});
	
	it('should return 201 if the friendship was created', async () => {

	});

});

describe('PATCH /internal/friendships/:id', () => {

	it('should return 404 if the friendship was not found', async () => {

	});

	it('should return 400 if the friendship could not be accepted', async () => {

	});

	it('should return 200 if the friendship was accepted', async () => {

	});

});

describe('DELETE /internal/friendships', () => {

	it('should return 404 if the friendship was not found', async () => {

	});

	it('should return 204 if the friendship was deleted', async () => {

	});


});

describe('DELETE /internal/friendships', () => {

	it('should return 204 if all friendships were deleted', async () => {

	});
});
