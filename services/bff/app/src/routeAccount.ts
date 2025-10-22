import { createAccount } from './bffAccount.service.js';
import type { FastifyInstance } from 'fastify';
import type { UserData } from './bff.interface.js';
import type { ProfileCreationResult } from "./bff.interface.js";
import { createUserProfile } from './bffAccount.service.js';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { validateCredentials } from './bffAccount.service.js';

//TODO: find a secure way to handle JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-and-long-key-for-development';

/*
//Install the dotenv package
npm install dotenv

// At the very top of your main server file
import 'dotenv/config';

// Now, process.env is populated with variables from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

// You can now use this variable throughout your file
console.log(`Successfully loaded JWT_SECRET: ${JWT_SECRET}`);

// --- Example of using it in your code ---
import * as jwt from 'jsonwebtoken';

// ... inside a function
const payload = { userID: 123 };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
*/

export async function bffAccountRoutes(serv: FastifyInstance) {

	serv.post('/account/login', async (request, reply) => {
		try {
			const { username, password } = request.body as { username: string, password: string };

			const validationResponse = await validateCredentials(username, password);

			if (!validationResponse)
				return reply.code(401).send({ message: 'Invalid credentials.' });

			const UserData = await validationResponse.json() as UserData;

			const payload = { userID: UserData.userID, username: UserData.username };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[BFF] An unexpected error occurred while login: ${error}`);
			throw (error);
		}
	});

	serv.post('/account/register', async (request, reply) => {
		let newAccountId: number | null = null;
		try {
			const { username, password } = request.body as { username: string, password: string };

			if (!username || !password)
				return (reply.code(400).send({ message: 'Missing username or password.' }));

			const hashedPassword = await bcrypt.hash(password, 10);

			const accountResponse = createAccount(username, hashedPassword);
			if (!accountResponse)
				return (reply.code(409).send({ message: 'Username taken' }));

			const newAccount = await accountResponse as { userID: number };
			newAccountId = newAccount.userID;

			const profileResponse = createUserProfile(newAccountId, username);
			switch ((await profileResponse).errorCode) {
				case 'success':
					return reply.code(201).send({ message: 'Account and profile created successfully!' });
				case 'conflict':
					throw new Error('Profile already existed for a newly created account.');
				case 'user_not_found':
					throw new Error(`User service could not find newly created userID: ${newAccountId}`);
			}

		} catch (error) {
			serv.log.error(`[BFF] Error during registration: ${error}`);
			//TODO: add helper function to delete account if user failed
			if (newAccountId) {
				serv.log.warn(`Rolling back account creation for userID: ${newAccountId}`);
				await fetch(`https://account:1414/internal/account/${newAccountId}`, {
					method: 'DELETE'
				});
			}
			return (reply.code(503).send({ message: 'A backend service failed during registration.' }));
		}
	});

	serv.delete('account/delete', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const username = request.user.username;
			const { password } = request.body as { password: string };

			const validationResponse = await validateCredentials(username, password);

			if (!validationResponse.ok)
				return reply.code(validationResponse.status).send({ message: 'Invalid credentials.' });

			const deletionResults = await Promise.allSettled([
				fetch(`http://friends:1616/internal/friends/${userID}/friendships`, { method: 'DELETE' }),
				fetch(`http://users:2626/internal/users/${userID}`, { method: 'DELETE' }),
				fetch(`http://account:1414/internal/account/${userID}`, { method: 'DELETE' })
			]);
			const failures = deletionResults.filter(response => response.status === 'rejected' || (response.status === 'fulfilled' && !response.value.ok));

			if (failures.length > 0) {
				serv.log.error({
					msg: `[CRITICAL] Partial deletion for userID: ${userID}.`,
					failures: failures
				});
				return reply.code(500).send({
					message: 'Failed to completely delete account. Please contact support.'
				});
			}
			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[BFF] Error during account deletion: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});
}
