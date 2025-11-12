import type { FastifyInstance } from 'fastify';
import type { UserAuth } from './bff.interface.js';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {/*  createAccount, */ deleteFriendship, deleteAccount,/*  createUserProfile,  */validateCredentials, deleteUser } from './bffAccount.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-and-long-key-for-development';

export async function bffAccountRoutes(serv: FastifyInstance) {

	// serv.post('/account/login', async (request, reply) => {
	// 	try {
	// 		const { username, password } = request.body as { username: string, password: string };

	// 		const validationResponse = await validateCredentials(serv.log, username, password);

	// 		if (!validationResponse)
	// 			return reply.code(401).send({ message: 'Invalid credentials.' });

	// 		const UserAuth = await validationResponse.json() as UserAuth;

	// 		const payload = { userID: UserAuth.userID, username: UserAuth.username };
	// 		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

	// 		return reply.code(200).send({ token: token });
	// 	} catch (error) {
	// 		serv.log.error(`[BFF] An unexpected error occurred while login: ${error}`);
	// 		throw (error);
	// 	}
	// });

	// serv.post('/account/register', async (request, reply) => {
	// 	let newAccountId: number | null = null;
	// 	try {
	// 		const { username, password } = request.body as { username: string, password: string };

	// 		if (!username || !password)
	// 			return (reply.code(400).send({ message: '[BFF] Missing username or password.' }));

	// 		const hashedPassword = await bcrypt.hash(password, 10);

	// 		const accountResponse = createAccount(serv.log, username, hashedPassword);
	// 		if (!accountResponse)
	// 			return (reply.code(409).send({ message: '[BFF] Username taken' }));

	// 		const newAccount = await accountResponse as { userID: number };
	// 		newAccountId = newAccount.userID;

	// 		const profileResponse = createUserProfile(serv.log, newAccountId, username);
	// 		switch ((await profileResponse).errorCode) {
	// 			case 'success':
	// 				return reply.code(201).send({ message: '[BFF] Account and profile created successfully!' });
	// 			case 'conflict':
	// 				throw new Error('[BFF] Profile already existed for a newly created account.');
	// 			case 'user_not_found':
	// 				throw new Error(`[BFF] User service could not find newly created userID: ${newAccountId}`);
	// 		}

	// 	} catch (error) {
	// 		serv.log.error(`[BFF] Error during registration: ${error}`);
	// 		if (newAccountId) {
	// 			serv.log.warn(`[BFF] Rolling back account creation for userID: ${newAccountId}`);
	// 			const response = deleteAccount(serv.log, newAccountId);
	// 			if (!response)
	// 				return (reply.code(404).send({ message: '[BFF] User not created and matching account not deleted' }));
	// 		}
	// 		throw (error);
	// 	}
	// });

	serv.delete('/account/delete', async (request, reply) => {
		try {
			const userID = request.user.userID;

			//UNCOMMENT FOR PASSWORD CHECK FOR ACCOUNT DELETION

			//const username = request.user.username;
			//const { password } = request.body as { password: string };
			//if (!password) {
			//	return (reply.code(400).send({ message: '[BFF] Password is required.' }));
			//const validationResponse = await validateCredentials(username, password);
			//if (!validationResponse)
			//	return (reply.code(401).send({ message: '[BFF] Invalid credentials.' }));

			const deletionResults = await Promise.allSettled([
				deleteFriendship(serv.log, userID),
				deleteUser(serv.log, userID),
				deleteAccount(serv.log, userID)
			]);

			const failures = deletionResults.filter(response => response.status === 'rejected');

			if (failures.length > 0) {
				serv.log.error({
					msg: `[CRITICAL][BFF] Partial deletion for userID: ${userID}.`,
					failures: failures.map(f => (f as PromiseRejectedResult).reason?.message || f.reason)
				});
				return reply.code(500).send({
					message: '[BFF] Failed to completely delete account. Please contact support.'
				});
			}

			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[BFF] Error during account deletion: ${error}`);
			throw (error);
		}
	});
}
