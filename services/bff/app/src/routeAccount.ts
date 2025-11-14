import type { FastifyInstance } from 'fastify';
import type { UserAuth } from './bff.interface.js';

import * as bcrypt from 'bcrypt';

import { createAccount, deleteFriendship, deleteAccount, createUserProfile, validateCredentials, deleteUser } from './bffAccount.service.js';


export async function bffAccountRoutes(serv: FastifyInstance) {

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
				throw new Error('[BFF] Failed to completely delete account. Please contact support.') ;
			}

			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[BFF] Error during account deletion: ${error}`);
			throw (error);
		}
	});
}
