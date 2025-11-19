import type { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcrypt';
import { createAccount, deleteAccount, createUserProfile, validateCredentials } from './auth.service.js';

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
	serv.post('/login/', { schema: authSchema }, async (request, reply) => {
		try {
			const { username, password } = request.body as { username: string; password: string };

			const validationResponse = await validateCredentials(serv.log, username, password);

			if (!validationResponse) {
				return reply.code(401).send({ message: 'Invalid credentials.' });
			}

			const tokenPayload = { userID: validationResponse.userID, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			reply.setCookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[BFF] An unexpected error occurred while login: ${error}`);
			throw error;
		}
	});

	serv.post('/register/', { schema: authSchema }, async (request, reply) => {
		let newAccountId: number | null = null;
		try {
			const { username, password } = request.body as { username: string; password: string };

			const hashedPassword = await bcrypt.hash(password, 12);

			const accountResponse = createAccount(serv.log, username, hashedPassword);
			if (!accountResponse) {
				return reply.code(409).send({ message: '[BFF] Username taken' });
			}

			const newAccount = await accountResponse as { userID: number };
			newAccountId = newAccount.userID;

			const profileResponse = createUserProfile(serv.log, newAccountId, username);

			const tokenPayload = { userID: newAccountId, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			reply.setCookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

			switch ((await profileResponse).errorCode) {
				case 'success':
					return reply.code(201).send({ message: '[BFF] Account and profile created successfully!' });
				case 'conflict':
					throw new Error('[BFF] Profile already existed for a newly created account.');
				case 'user_not_found':
					throw new Error(`[BFF] User service could not find newly created userID: ${newAccountId}`);
			}
		} catch (error) {
			serv.log.error(`[BFF] Error during registration: ${error}`);
			if (newAccountId) {
				serv.log.warn(`[BFF] Rolling back account creation for userID: ${newAccountId}`);
				const response = deleteAccount(serv.log, newAccountId);
				if (!response) {
					return reply.code(404).send({ message: '[BFF] User not created and matching account not deleted' });
				}
			}
			throw error;
		}
	});
}
