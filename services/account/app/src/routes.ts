import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'
import * as bcrypt from 'bcrypt';

interface AccountSettingsRow {
	defaultLang: string;
}

export async function accountRoutes(serv: FastifyInstance) {

	//usersStatus is always a hardcoded 1 for now, not even sure to keep it honestly
	//TESTED
	serv.post('/internal/account/register', async (request, reply) => {
		try {
			const { username, hashedPassword } = request.body as { username: string, hashedPassword: string };
			const usernameTaken = await checkUsernameUnique(serv.dbAccount, username);
			if (usernameTaken)
				return (reply.code(409).send({ message: 'Username taken' }));

			const query = `
				INSERT INTO account (hashedPassword, username, userStatus, registerDate, defaultLang)
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
	serv.post('/internal/account/login', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`
			const user = await serv.dbAccount.get(query, [username]);
			if (!user)
				return (reply.code(401).send({ message: '[ACCOUNT] Account not found.' }));
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
	//TODO :fix 409 error return
	serv.patch('/internal/account/:userID', async (request, reply) => {
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

	serv.delete('/internal/account', async (request, reply) => {
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

	//TODO: modify this route to return a userData interface if possible (see where this route is used)
	serv.get('/internal/account/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT
					username,
					userStatus,
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
					message: 'User data not found.'
				}));
			}

			return (reply.code(200).send({ success: true, userData }));
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching account data: ${error}`);
			throw (error);
		}
	});

	serv.post('/internal/account/userDataBatch', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send([]));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT
					p.username,
					p.userStatus,
					p.registerDate,
					p.defaultLang,
					p.registerDate
				FROM
					account p
				WHERE
					p.userID IN (${placeholders})
			`;

			const usersData = await serv.dbAccount.all(query, userIDs);
			return (reply.code(200).send({ success: true, usersData }));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching account data batch: ${error} `);
			throw (error);
		}
	});
}
