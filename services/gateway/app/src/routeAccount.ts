import type { FastifyInstance } from 'fastify';
import type { UserData } from './gateway.interface.js';

import * as bcrypt from 'bcrypt';
//import * as jwt from 'jsonwebtoken';
import { validateCredentials } from './gatewayAccount.service.js';
import { updateAccountUsername } from './gatewayAccount.service.js';
import { updateAccountPassword } from './gatewayAccount.service.js';
import { updateUserProfileUsername } from './gatewayAccount.service.js';

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

export async function routeAccount(serv: FastifyInstance) {

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
			serv.log.error(`[API Gateway] Login error: ${error}`);
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
			serv.log.error(`[API Gateway] Username update error: ${error}`);

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
			serv.log.error(`[API Gateway] Password update error: ${error}`);
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

			const accountResponse = await fetch('http://account-service:3000/internal/accounts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, hashedPassword })
			});

			if (!accountResponse.ok)
				return (reply.code(accountResponse.status).send(await accountResponse.json()));

			const newAccount = await accountResponse.json() as { userID: number, username: string };
			newAccountId = newAccount.userID;

			const profileResponse = await fetch(`http://users-service:3000/internal/users/${newAccountId}/profile`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: newAccount.username })
			});

			if (!profileResponse.ok)
				throw (new Error('Profile creation failed.'));

			return (reply.code(201).send({ message: 'Account and profile created successfully!' }));

		} catch (error) {
			serv.log.error(`[API Gateway] Error during registration: ${error}`);
			// If the profile creation failed after the account was created, we delete the account.
			if (newAccountId) {
				serv.log.warn(`Rolling back account creation for userID: ${newAccountId}`);
				await fetch(`http://account-service:3000/internal/accounts/${newAccountId}`, {
					method: 'DELETE'
				});
			}
			return (reply.code(503).send({ message: 'A backend service failed during registration.' }));
		}
	});
}
