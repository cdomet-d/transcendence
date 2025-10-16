import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'
import * as bcrypt from 'bcrypt';

export async function accountRoutes(serv: FastifyInstance) {

	//TODO: usersStatus is always a hardcoded 1 for now, not even sure to keep it honestly
	serv.post('/internal/account/register', async (request, reply) => {
		try {
			const { username, hashedPassword } = request.body as { username: string, hashedPassword: string };

			const usernameTaken = await checkUsernameUnique(serv.dbAccount, username);
			if (usernameTaken)
				return reply.code(409).send({ message: 'Username taken' });

			const query = `
				INSERT INTO usersAuth (hashedPassword, username, userStatus, registerDate)
				VALUES (?, ?, 1, ?)
			`;
			const params = [hashedPassword, username, new Date().toISOString()];
			const result = await serv.dbAccount.run(query, params);

			if (result.changes === 0 || !result.lastID)
				return reply.code(500).send({ message: 'Failed to create account record.' });

			return reply.code(201).send({
				userID: result.lastID,
				username: username
			});

		} catch (error) {
			serv.log.error(`Error creating account record: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
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
				return (reply.code(401).send({ message: 'Invalid credentials.' }));

			const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
			if (!passwordMatches)
				return (reply.code(401).send({ message: 'Invalid credentials.' }));

			return (reply.code(200).send({
				success: true,
				message: 'Login successful!',
			}));

		} catch (error) {
			serv.log.error(`Error when trying to login ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	serv.patch('/internal/accounts/:userID/password', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newHashedPassword } = request.body as { newHashedPassword: string };

			const query = `UPDATE userAuth SET hashedPassword = ? WHERE userID = ?`;
			const result = await serv.dbAccount.run(query, [newHashedPassword, userID]);

			if (result.changes === 0)
				return reply.code(404).send({ message: 'User not found for password update.' });

			return reply.code(200).send({ message: 'Account password updated.' });
		} catch (error) {
			serv.log.error(`Error updating account password: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	serv.patch('/internal/accounts/:userID/username', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newUsername } = request.body as { newUsername: string };

			const query = `UPDATE usersAuth SET username = ? WHERE userID = ?`;
			const result = await serv.dbAccount.run(query, [newUsername, userID]);

			if (result.changes === 0)
				return reply.code(404).send({ message: 'User not found for username update.' });

			return reply.code(200).send({ message: 'Account username updated.' });
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')
				return reply.code(409).send({ message: 'Username is already taken.' });

			serv.log.error(`Error updating account username: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	serv.delete('/internal/accounts/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `DELETE FROM usersAuth WHERE userID = ?`;

			await serv.dbAccount.run(query, [userID]);

			return (reply.code(204).send());
		} catch (error) {
			serv.log.error(`Error deleting account: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});
}
