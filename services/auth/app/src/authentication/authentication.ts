import type { FastifyInstance } from 'fastify';

import * as bcrypt from 'bcrypt';

import { deleteAccount, createUserProfile, checkUsernameUnique } from './auth.service.js';

const authSchema = {
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: { type: 'string' },
			password: { type: 'string' }
		}
	}
};

export async function authenticationRoutes(serv: FastifyInstance) {

	serv.post('/login', { schema: authSchema }, async (request, reply) => {
		try {
			const { username, password } = request.body as { username: string, password: string };

			const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`

			const account = await serv.dbAuth.get(query, [username]);
			if (!account)
				return (reply.code(404).send({ message: '[AUTH] Account not found.' }));

			const passwordMatches = await bcrypt.compare(password, account.hashedPassword);

			if (!passwordMatches)
				return (reply.code(401).send({ message: '[AUTH] Invalid credentials.' }));

			const tokenPayload = { userID: account.userID, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			reply.setCookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[AUTH] An unexpected error occurred while login: ${error}`);
			throw (error);
		}
	});

	serv.post('/register/', { schema: authSchema }, async (request, reply) => {
		let newAccountId: number | null = null;
		try {
			const { username, password } = request.body as { username: string, password: string };

			if (!username || !password)
				return (reply.code(400).send({ message: '[AUTH] Missing username or password.' }));
			
			const hashedPassword = await bcrypt.hash(password, 12);

			const usernameTaken = await checkUsernameUnique(serv.dbAuth, username);
			if (usernameTaken)
				return (reply.code(409).send({ message: 'Username taken' }));

			const query = `
				INSERT INTO account (hashedPassword, username)
				VALUES (?, ?)
			`;

			const params = [hashedPassword, username];
			const account = await serv.dbAuth.run(query, params);

			if (account.changes === 0 || !account.lastID)
				throw (new Error('[AUTH] Failed to create account record.'));

			newAccountId = account.lastID;

			const usersResponse = createUserProfile(serv.log, newAccountId, username);

			const tokenPayload = { userID: newAccountId, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			reply.setCookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

			switch ((await usersResponse).errorCode) {
				case 'success':
					return reply.code(201).send({ message: '[AUTH] Account and profile created successfully!' });
				case 'conflict':
					throw new Error('[AUTH] Profile already existed for a newly created account.');
				case 'user_not_found':
					throw new Error(`[AUTH] User service could not find newly created userID: ${newAccountId}`);
			}

		} catch (error) {
			serv.log.error(`[AUTH] Error during registration: ${error}`);
			if (newAccountId) {
				serv.log.warn(`[AUTH] Rolling back account creation for userID: ${newAccountId}`);
				const response = deleteAccount(serv.dbAuth, serv.log, newAccountId);
				if (!response)
					return (reply.code(404).send({ message: '[AUTH] User not created and matching account not deleted' }));
			}
			throw (error);
		}
	});

	serv.delete('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `DELETE FROM account WHERE userID = ?`;

			const result = await serv.dbAuth.run(query, [userID]);
			if (!result.changes)
				return (reply.code(404).send({ message: '[AUTH] Account not found' }))
			return (reply.code(204).send());
		} catch (error) {
			serv.log.error(`[AUTH] Error deleting account: ${error}`);
			throw (error);
		}
	});
}
