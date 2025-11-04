import type { FastifyInstance } from 'fastify';
import { buildServer } from './app.js';
import * as bcrypt from 'bcrypt';

// We declare 'app' here so we can access it in all test blocks
let app: FastifyInstance;

// 'beforeAll' runs once, before any tests start
beforeAll(async () => {
	// Build the server (it will use the test DB thanks to our npm script)
	app = await buildServer();
});

// 'afterAll' runs once, after all tests are finished
afterAll(async () => {
	// Close the server and database connection
	await app.close();
});

// 'beforeEach' runs before EACH 'it' test block
beforeEach(async () => {
	// We wipe the tables to ensure each test is isolated
	// This is better than 'npm run test:setup' for isolation
	await app.dbAccount.exec('DELETE FROM account');
	// You can re-run your seed.sql here if you want
	// For this test, let's just insert what we need
});

describe('GET /internal/account/:userID', () => {
	it('should return a user profile if the user exists', async () => {
		await app.dbAccount.run(
			'INSERT INTO account (userID, username, defaultLang) VALUES (?, ?, ?)',
			[123, 'testuser', 'en']
		);

		const response = await app.inject({
			method: 'GET',
			url: '/internal/account/123'
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.userData.username).toBe('testuser');
		expect(body.userData.defaultLang).toBe('en');
	});

	it('should return 404 if the user does not exist', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/internal/account/999'
		});

		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User data not found.');
	});
});
``
describe('POST /internal/account/register', () => {
	it('should create a user if the username is not already taken', async () => {
		const newUser = {
			username: 'new_user',
			hashedPassword: 'fake_hash_password_123'
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/register',
			payload: newUser
		});

		const body = response.json();

		expect(response.statusCode).toBe(201);
		expect(body.username).toBe('new_user');
		expect(body.userID).toBeDefined();

		const dbUser = await app.dbAccount.get(
			'SELECT * FROM account WHERE username = ?',
			['new_user']
		);

		expect(dbUser).toBeDefined();
		expect(dbUser.hashedPassword).toBe('fake_hash_password_123');
	});

	it('should return 409 if the username is already taken', async () => {
		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword) VALUES (?, ?)',
			['existing_user', 'some_hash']
		);

		const duplicateUser = {
			username: 'existing_user',
			hashedPassword: 'another_hash_456'
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/register',
			payload: duplicateUser
		});

		const body = response.json();

		expect(response.statusCode).toBe(409);
		expect(body.message).toBe('Username taken');

		const userCount = await app.dbAccount.get(
			'SELECT COUNT(*) as count FROM account'
		);
		expect(userCount.count).toBe(1);
	});
});

describe('GET /internal/account/login', () => {
	it('should return 200 and success message for valid credentials', async () => {
		const plainPassword = 'my-secret-password-123';
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword) VALUES (?, ?)',
			['login_user', hashedPassword]
		);

		const credentials = {
			username: 'login_user',
			password: plainPassword
		};

		const response = await app.inject({
			method: 'GET', // Your route is defined as GET
			url: '/internal/account/login',
			payload: credentials // Fastify allows GET with a body
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('[ACCOUNT] Login successful!');
	});

	it('should return 401 for invalid credentials', async () => {
		const plainPassword = 'my-secret-password-123';
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword) VALUES (?, ?)',
			['login_user', hashedPassword]
		);

		const credentials = {
			username: 'login_user',
			password: 'wrong-password'
		};

		const response = await app.inject({
			method: 'GET',
			url: '/internal/account/login',
			payload: credentials
		});

		const body = response.json();

		expect(response.statusCode).toBe(401);
		expect(body.message).toBe('[ACCOUNT] Invalid credentials.');
	});
});
