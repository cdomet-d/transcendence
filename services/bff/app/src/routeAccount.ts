import type { FastifyInstance } from 'fastify';
import type { UserData } from './bff.interface.js';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { validateCredentials } from './bffAccount.service.js';
import { updateAccountUsername } from './bffAccount.service.js';
import { updateAccountPassword } from './bffAccount.service.js';
import { updateUserProfileUsername } from './bffAccount.service.js';

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

			if (!validationResponse.ok)
				return reply.code(validationResponse.status).send({ message: 'Invalid credentials.' });

			const UserData = await validationResponse.json() as UserData;

			const payload = { userID: UserData.userID, username: UserData.username };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[BFF] Login error: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.patch('/account/username', async (request, reply) => {
		let isAuthUpdated = false;
		const userID = request.user.userID;
		const oldUsername = request.user.username;
		const { newUsername } = request.body as { newUsername: string };

		try {
			const accountResponse = await updateAccountUsername(userID, newUsername);

			if (!accountResponse.ok)
				return reply.code(accountResponse.status).send(await accountResponse.json());
			isAuthUpdated = true;

			const profileResponse = await updateUserProfileUsername(userID, newUsername);

			if (!profileResponse.ok)
				throw new Error('Profile service update failed.');

			return reply.code(200).send({ message: 'Username updated successfully.' });

		} catch (error) {
			serv.log.error(`[BFF] Username update error: ${error}`);

			if (isAuthUpdated) {
				serv.log.warn(`Rolling back username change for userID: ${userID}`);
				await updateAccountUsername(userID, oldUsername);
			}
			return reply.code(503).send({ message: 'A backend service failed during username update.' });
		}
	});

	serv.patch('/account/password', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const { newPassword } = request.body as { newPassword: string };

			const newHashedPassword = await bcrypt.hash(newPassword, 10);

			const response = await updateAccountPassword(userID, newHashedPassword);

			if (!response.ok)
				return reply.code(response.status).send({ message: 'Failed to update password.' });

			return reply.code(200).send({ message: 'Password updated successfully.' });

		} catch (error) {
			serv.log.error(`[BFF] Password update error: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.post('/account/register', async (request, reply) => {
		let newAccountId: number | null = null;
		try {
			const { username, password } = request.body as { username: string, password: string };

			if (!username || !password)
				return (reply.code(400).send({ message: 'Missing username or password.' }));

			const hashedPassword = await bcrypt.hash(password, 10);

			const accountResponse = await fetch('https://account:1414/internal/account/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, hashedPassword })
			});

			if (!accountResponse.ok)
				return (reply.code(accountResponse.status).send(await accountResponse.json()));

			const newAccount = await accountResponse.json() as { userID: number, username: string };
			newAccountId = newAccount.userID;

			const profileResponse = await fetch(`https://users:2626/internal/users/${newAccountId}/profile`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: newAccount.username })
			});

			if (!profileResponse.ok)
				throw (new Error('Profile creation failed.'));

			return (reply.code(201).send({ message: 'Account and profile created successfully!' }));

		} catch (error) {
			serv.log.error(`[BFF] Error during registration: ${error}`);
			// If the profile creation failed after the account was created, we delete the account.
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
