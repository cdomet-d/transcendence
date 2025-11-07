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

describe('GET /internal/users/:userID', () => {

	it('should return 404 when profile not found', async () => {
	
	});

	it('should return 200 when profile found', async () => {
	
	});
});

describe('GET /internal/users', () => {

	it('should return 404 when profile not found', async () => {
	
	});

	it('should return 400 when username not provided', async () => {
	
	});

	it('should return 200 when profile found', async () => {
	
	});
});

describe('POST /internal/users/profile', () => {

	it('should return 400 when userIDs not provided properly', async () => {
	
	});

	it('should return 200 when profiles found', async () => {
	
	});

	it('should return 200 when and empty interface when no profile was found ?', async () => {
	
	});
});

describe('POST /internal/users/:userID/profile', () => {

	it('should return 409 when profile with username already exists', async () => {
	
	});

	it('should return 201 when profile and stats created', async () => {
	
	});
});

describe('PATCH /internal/users/:userID', () => {

	it('should return 400 when not fields for update provided', async () => {
	
	});

	it('should return 404 when user not found', async () => {
	
	});

	it('should return 200 when user profile updated', async () => {
	
	});

	it('should return 409 when modify username with already taken username', async () => {
	
	});
});

describe('DELETE /internal/users/:userID', () => {

	it('should return 404 when user not found', async () => {
	
	});

	it('should return 204 when user profile and stats deleted', async () => {
	
	});
});

describe('GET /internal/users/:userID/stats', () => {

	it('should return 404 when user stats not found', async () => {
	
	});

	it('should return 200 when user stats found', async () => {
	
	});
});

describe('UPDATE /internal/users/:userID/stats', () => {

	it('should return 404 when user stats not found', async () => {
	
	});

	it('should return 200 if no stats to update', async () => {
	
	});

	it('should return 404 if user not found', async () => {
	
	});

	it('should return 200 if stats were updated', async () => {
	
	});
});

describe('GET internal/users/:userID/userData', () => {

	it('should return 404 if user not found', async () => {
	
	});

	it('should return 200 if user found', async () => {
	
	});
});

describe('POST /internal/users/userDataBatch', () => {

	it('should return 200 if not user to get', async () => {
	
	});

	it('should return 200 if not users found', async () => {
	
	});
});
