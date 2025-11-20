import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'

interface AccountSettingsRow {
	defaultLang: string;
}

export async function accountRoutes(serv: FastifyInstance) {

	//usersStatus is always a hardcoded 1 for now, not even sure to keep it honestly
	//TESTED
	serv.post('/register', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { hashedPassword } = request.body as { hashedPassword: string };

			//const usernameTaken = await checkUsernameUnique(serv.dbAccount, username);
			//if (usernameTaken)
			//	return (reply.code(409).send({ message: 'Username taken' }));

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
	serv.post('/login', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`
			const user = await serv.dbAccount.get(query, [username]);
			if (!user)
				return (reply.code(404).send({ message: '[ACCOUNT] Account not found.' }));
			//const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

			if (user.hashedPassword != password)
				return (reply.code(401).send({ message: '[ACCOUNT] Invalid credentials.' }));

			return (reply.code(200).send({
				success: true,
				message: '[ACCOUNT] Login successful!',
				userID: user.userID
			}));

		} catch (error) {
			serv.log.error(`[ACCOUNT] Error when trying to login: ${error}`);
			throw error;
		}
	});

	//TESTED
	serv.patch('/:userID', async (request, reply) => {
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



	serv.get('/:userID', async (request, reply) => {
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
