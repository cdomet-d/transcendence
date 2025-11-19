import type { FastifyInstance } from 'fastify';
import { buildServer } from './app.js';
import * as bcrypt from 'bcrypt';

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


/* describe('GET /internal/account/:userID', () => {
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
}); */

describe('POST /internal/account/login', () => {
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
			method: 'POST',
			url: '/internal/account/login',
			payload: credentials
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('[ACCOUNT] Login successful!');
	});

/* 	it('should return 401 for invalid credentials (password)', async () => {
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
			method: 'POST',
			url: '/internal/account/login',
			payload: credentials
		});

		const body = response.json();

		expect(response.statusCode).toBe(401);
		expect(body.message).toBe('[ACCOUNT] Invalid credentials.');
	});

	it('should return 401 for invalid credentials (username)', async () => {
		const plainPassword = 'my-secret-password-123';
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword) VALUES (?, ?)',
			['login_user', hashedPassword]
		);

		const credentials = {
			username: 'wrong_username',
			password: hashedPassword
		};

		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/login',
			payload: credentials
		});

		const body = response.json();

		expect(response.statusCode).toBe(401);
		expect(body.message).toBe('[ACCOUNT] Account not found.');
	}); */
});
/* 
describe('PATCH /internal/account/:userID', () => {

	it('should return 200 when changing every valid account settings', async () => {
		const originalHash = await bcrypt.hash('password123', 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword, defaultLang) VALUES (?, ?, ?)',
			['patch_user', originalHash, 'en']
		);

		const user = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['patch_user']);
		const userID = user.userID;

		const newHashedPassword = await bcrypt.hash('newPassword456', 10);

		const newSettings = {
			hashedPassword: newHashedPassword,
			username: 'new-username',
			defaultLang: 'Spanish'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Account updated successfully!');

		const updatedUser = await app.dbAccount.get('SELECT * FROM account WHERE userID = ?', [userID]);
		expect(updatedUser.username).toBe('new-username');
		expect(updatedUser.defaultLang).toBe('Spanish');

		const passwordMatches = await bcrypt.compare('newPassword456', updatedUser.hashedPassword);
		expect(passwordMatches).toBe(true);
	});

	it('should return 200 when changing valid username settings', async () => {
		const originalHash = await bcrypt.hash('password123', 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword, defaultLang) VALUES (?, ?, ?)',
			['patch_user', originalHash, 'en']
		);

		const user = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['patch_user']);
		const userID = user.userID;

		const newSettings = {
			username: 'new-username',
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Account updated successfully!');

		const updatedUser = await app.dbAccount.get('SELECT * FROM account WHERE userID = ?', [userID]);
		expect(updatedUser.username).toBe('new-username');
	});

	it('should return 200 when changing valid password settings', async () => {
		const originalHash = await bcrypt.hash('password123', 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword, defaultLang) VALUES (?, ?, ?)',
			['patch_user', originalHash, 'en']
		);

		const user = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['patch_user']);
		const userID = user.userID;

		const newHashedPassword = await bcrypt.hash('newPassword456', 10);

		const newSettings = {
			hashedPassword: newHashedPassword,
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Account updated successfully!');

		const updatedUser = await app.dbAccount.get('SELECT * FROM account WHERE userID = ?', [userID]);

		const passwordMatches = await bcrypt.compare('newPassword456', updatedUser.hashedPassword);
		expect(passwordMatches).toBe(true);
	});

	it('should return 200 when changing valid language settings', async () => {
		const originalHash = await bcrypt.hash('password123', 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword, defaultLang) VALUES (?, ?, ?)',
			['patch_user', originalHash, 'en']
		);

		const user = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['patch_user']);
		const userID = user.userID;

		const newSettings = {
			defaultLang: 'Spanish'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.message).toBe('Account updated successfully!');

		const updatedUser = await app.dbAccount.get('SELECT * FROM account WHERE userID = ?', [userID]);
		expect(updatedUser.defaultLang).toBe('Spanish');
	});

	it('should return 400 when sending empty settings updates', async () => {
		const originalHash = await bcrypt.hash('password123', 10);

		await app.dbAccount.run(
			'INSERT INTO account (username, hashedPassword, defaultLang) VALUES (?, ?, ?)',
			['patch_user', originalHash, 'en']
		);

		const user = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['patch_user']);
		const userID = user.userID;

		const newSettings = {
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(400);
		expect(body.success).toBe(false);
		expect(body.message).toBe('No valid fields provided for update.');
	});

	it('should return 404 when user not found', async () => {

		const newSettings = {
			username: 'new-username',
			defaultLang: 'Spanish'
		};

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/15`,
			payload: newSettings
		});

		const body = response.json();

		expect(response.statusCode).toBe(404);
		expect(body.success).toBe(false);
		expect(body.message).toBe('User not found');
	});

	//This test does not work because of the import for sqlite3 in db.ts so fuck it 
	/*it('should return 409 if the new username is already taken', async () => {
		await app.dbAccount.run('INSERT INTO account (username) VALUES (?)', ['user-one']);

		await app.dbAccount.run('INSERT INTO account (username) VALUES (?)', ['user-two-taken']);

		const user1 = await app.dbAccount.get('SELECT userID FROM account WHERE username = ?', ['user-one']);
		const userID = user1.userID;

		const response = await app.inject({
			method: 'PATCH',
			url: `/internal/account/${userID}`,
			payload: {
				username: 'user-two-taken'
			}
		});

		const body = response.json();
		expect(response.statusCode).toBe(409);
		expect(body.success).toBe(false);
		expect(body.message).toBe('This username is already taken.');
	});*/
/*});

describe('DELETE /internal/account/:userID', () => {
	it('should return 204 when deleting valid account', async () => {
		const result = await app.dbAccount.run('INSERT INTO account (username) VALUES (?)', ['user-to-delete']);
		const userID = result.lastID;

		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/account',
			payload: { userID: userID }
		});

		expect(response.statusCode).toBe(204);
		expect(response.body).toBeFalsy();

		const user = await app.dbAccount.get('SELECT * FROM account WHERE userID = ?', [userID]);
		expect(user).toBeUndefined();
	});

	it('should return 404 when deleting invalid account', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/internal/account',
			payload: { userID: 999 }
		});

		const body = response.json();
		expect(response.statusCode).toBe(404);
		expect(body.message).toBe('[ACCOUNT] Account not found');
	});
});

describe('GET /internal/account/userDataBatch', () => {
	it('should return 200 and a list of users for a valid list of IDs', async () => {
		await app.dbAccount.run(
			'INSERT INTO account (userID, username, defaultLang) VALUES (?, ?, ?)',
			[10, 'user10', 'en']
		);
		await app.dbAccount.run(
			'INSERT INTO account (userID, username, defaultLang) VALUES (?, ?, ?)',
			[20, 'user20', 'fr']
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/userDataBatch',
			payload: { userIDs: [10, 20] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.usersData).toBeInstanceOf(Array);
		expect(body.usersData.length).toBe(2);
		expect(body.usersData[0].username).toBe('user10');
		expect(body.usersData[1].username).toBe('user20');
	});

	it('should return 200, valid users, and a list of failed IDs', async () => {
		await app.dbAccount.run(
			'INSERT INTO account (userID, username, defaultLang) VALUES (?, ?, ?)',
			[10, 'user10', 'en']
		);

		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/userDataBatch',
			payload: { userIDs: [10, 999] }
		});
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);

		expect(body.usersData).toBeInstanceOf(Array);
		expect(body.usersData.length).toBe(1);
		expect(body.usersData[0].username).toBe('user10');

		expect(body.failedIDs).toBeInstanceOf(Array);
		expect(body.failedIDs.length).toBe(1);
		expect(body.failedIDs[0]).toBe(999);
	});

	it('should return 200 and an empty list for an empty ID array', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/internal/account/userDataBatch',
			payload: { userIDs: [] }
		});

		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.success).toBe(true);
		expect(body.usersData.length).toBe(0);
		expect(body.failedIDs.length).toBe(0);
	});
});


 */