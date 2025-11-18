import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'
import * as bcrypt from 'bcrypt';

interface AccountSettingsRow {
	defaultLang: string;
}

export async function accountRoutes(serv: FastifyInstance) {

	//usersStatus is always a hardcoded 1 for now, not even sure to keep it honestly
	//TESTED
	serv.post('/api/account/register', async (request, reply) => {
		try {
			const { username, hashedPassword } = request.body as { username: string, hashedPassword: string };
			const usernameTaken = await checkUsernameUnique(serv.dbAccount, username);
			if (usernameTaken)
				return (reply.code(409).send({ message: 'Username taken' }));

			const query = `
				INSERT INTO account (hashedPassword, username, userRole, registerDate, defaultLang)
				VALUES (?, ?, 1, ?, ?)
			`;
			const params = [hashedPassword, username, new Date().toISOString(), 'English'];
			const response = await serv.dbAccount.run(query, params);

			if (response.changes === 0 || !response.lastID)
				throw (new Error('[ACCOUNT] Failed to create account record.'));

			return (reply.code(201).send({
				userID: response.lastID,
				username: username
			}));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error when trying to register: ${error}`);
			throw (error);
		}
	});

	//TESTED
	serv.post('/api/account/login', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`
			const user = await serv.dbAccount.get(query, [username]);
			if (!user)
				return (reply.code(404).send({ message: '[ACCOUNT] Account not found.' }));
			const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

			if (!passwordMatches)
				return (reply.code(401).send({ message: '[ACCOUNT] Invalid credentials.' }));

			return (reply.code(200).send({
				success: true,
				message: '[ACCOUNT] Login successful!',
			}));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error when trying to login: ${error}`);
			throw error;
		}
	});

	//TESTED but 
	serv.patch('/api/account/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const body = request.body as { [key: string]: any };

			const validKeys = [
				'hashedPassword',
				'username',
				'defaultLang'
			];

			const keysToUpdate = Object.keys(body).filter(key =>
				validKeys.includes(key) && body[key] !== ''
			);

			if (keysToUpdate.length === 0) {
				return (reply.code(400).send({
					success: false,
					message: 'No valid fields provided for update.'
				}));
			}

			const setClauses = keysToUpdate.map(key => `${key} = ?`).join(', ');
			const params = keysToUpdate.map(key => body[key]);
			params.push(userID);

			const query = `
				UPDATE account SET ${setClauses} WHERE userID = ?
			`;

			const response = await serv.dbAccount.run(query, params);
			if (response.changes === 0) {
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			}

			return (reply.code(200).send({
				success: true,
				message: 'Account updated successfully!'
			}));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')
				return (reply.code(409).send({ success: false, message: 'This username is already taken.' }));
			serv.log.error(`Error updating account: ${error}`);
			throw (error);
		}
	});

	serv.delete('/api/account', async (request, reply) => {
		try {
			const { userID } = request.body as { userID: string };

			const query = `DELETE FROM account WHERE userID = ?`;

			const result = await serv.dbAccount.run(query, [userID]);
			if (!result.changes)
				return (reply.code(404).send({ message: '[ACCOUNT] Account not found' }))
			return (reply.code(204).send());
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error deleting account: ${error}`);
			throw (error);
		}
	});

	serv.get('/api/account/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT
					username,
					userRole,
					registerDate,
					defaultLang
				FROM
					account
				WHERE
					userID = ?
			`;

			const userData = await serv.dbAccount.get(query, [userID]);
			if (!userData) {
				return (reply.code(404).send({
					success: false,
					message: '[ACCOUNT] Account data not found.'
				}));
			}

			return (reply.code(200).send({ success: true, userData }));
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching account settings: ${error}`);
			throw (error);
		}
	});

	serv.post('/internal/account/accountDataBatch', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send({ success: true, accountsData: [], failedIDs: [] }));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT
					p.userID, 
					p.username,
					p.userRole,
					p.registerDate,
					p.defaultLang,
					p.registerDate
				FROM
					account p
				WHERE
					p.userID IN (${placeholders})
			`;
			const accountsData = await serv.dbAccount.all(query, userIDs);

			const foundIDs = new Set(accountsData.map(user => user.userID));
			const failedIDs = userIDs.filter(id => !foundIDs.has(id));

			return (reply.code(200).send({
				success: true,
				accountsData: accountsData,
				failedIDs: failedIDs
			}));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching account data batch: ${error} `);
			throw (error);
		}
	});

	serv.get('/internal/account/:userID/accountData', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT
					p.userID, 
					p.username,
					p.registerDate,
					p.defaultLang,
				FROM
					account p
				WHERE
					p.userID  = ?
			`;
			const accountData = await serv.dbAccount.all(query, userID);
			if (!accountData) {
				return (reply.code(404).send({
					success: false,
					message: 'Account data not found.'
				}));
			}

			return (reply.code(200).send({
				success: true,
				accountData: accountData,
			}));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching account data : ${error} `);
			throw (error);
		}
	});
}
