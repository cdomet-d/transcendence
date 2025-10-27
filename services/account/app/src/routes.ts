import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'
import * as bcrypt from 'bcrypt';

interface AccountSettingsRow {
	defaultLang: string;
}

export async function accountRoutes(serv: FastifyInstance) {

	//TODO: usersStatus is always a hardcoded 1 for now, not even sure to keep it honestly
	serv.post('/internal/account/register', async (request, reply) => {
		try {
			const { username, hashedPassword } = request.body as { username: string, hashedPassword: string };

			const usernameTaken = await checkUsernameUnique(serv.dbAccount, username);
			if (usernameTaken)
				return (reply.code(409).send({ message: 'Username taken' }));

			const query = `
				INSERT INTO usersAuth (hashedPassword, username, userStatus, registerDate)
				VALUES (?, ?, 1, ?, English)
			`;
			const params = [hashedPassword, username, new Date().toISOString()];
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

	serv.get('/internal/account/login', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			const query = `
				SELECT userId, hashedPassword FROM usersAuth WHERE username = ?
			`
			const user = await serv.dbAccount.get(query, [username]);
			if (!user)
				return (reply.code(401).send({ message: '[ACCOUNT] Invalid credentials.' }));

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

	serv.patch('/internal/account/:userID/password', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newHashedPassword } = request.body as { newHashedPassword: string };

			const query = `UPDATE userAuth SET hashedPassword = ? WHERE userID = ?`;
			const response = await serv.dbAccount.run(query, [newHashedPassword, userID]);

			if (response.changes === 0)
				return reply.code(404).send({ message: '[ACCOUNT] User not found for password update.' });

			return reply.code(200).send({ message: '[ACCOUNT] Account password updated.' });
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error updating account password: ${error}`);
			return reply.code(500).send({ message: '[ACCOUNT] Internal server error' });
		}
	});

	serv.patch('/internal/account/:userID/username', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newUsername } = request.body as { newUsername: string };

			const query = `UPDATE usersAuth SET username = ? WHERE userID = ?`;
			const response = await serv.dbAccount.run(query, [newUsername, userID]);

			if (response.changes === 0)
				return (reply.code(404).send({ message: '[ACCOUNT] User not found for username update.' }));

			return (reply.code(200).send({ message: '[ACCOUNT] Account username updated.' }));
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')
				return (reply.code(409).send({ message: '[ACCOUNT] Username is already taken.' }));

			serv.log.error(`[ACCOUNT] Error updating account username: ${error}`);
			throw(error);
		}
	});

	serv.patch('/internal/account/:userID/defaultLang', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { defaultLang } = request.body as { defaultLang: string };

			const query = `UPDATE usersAuth SET defaultLang = ? WHERE userID = ?`;
			const response = await serv.dbAccount.run(query, [defaultLang, userID]);

			if (response.changes === 0)
				return (reply.code(404).send({ message: '[ACCOUNT] User not found for default language update.' }));

			return (reply.code(200).send({ message: '[ACCOUNT] Account default language updated.' }));
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error updating account username: ${error}`);
			throw(error);
		}
	});

	serv.delete('/internal/account', async (request, reply) => {
		try {
			const { userID } = request.body as { userID: string };

			const query = `DELETE FROM usersAuth WHERE userID = ?`;

			const result = await serv.dbAccount.run(query, [userID]);
			if (!result.changes)
				return (reply.code(404).send({message: '[ACCOUNT] Account not found'}))
			return (reply.code(204).send());
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error deleting account: ${error}`);
			return (reply.code(500).send({ message: '[ACCOUNT] Internal server error' }));
		}
	});

	serv.get('/internal/account/:userID/settings', async (request, reply) => {
		try {
			const userID = request.params as { userID: string };

			const query = `
				SELECT defaultLang FROM usersAuth WHERE userID = ?
			`
			const response = await serv.dbAccount.get(query, [userID]) as AccountSettingsRow | undefined;
			if (!response)
				return (reply.code(404).send({ message: '[ACCOUNT] Account not found.' }));
			return (reply.code(201).send({
				defaultLang: response.defaultLang
			}));
		} catch (error) {
			serv.log.error(`[ACCOUNT] Error fetching settings: ${error}`);
			return (reply.code(500).send({ message: '[ACCOUNT] Internal server error' }));
		}
	});
}
