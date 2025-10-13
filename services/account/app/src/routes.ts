import type { FastifyInstance } from 'fastify';
import { checkUsernameUnique } from './account.service.js'
import * as bcrypt from 'bcrypt';

export async function accountRoutes(serv: FastifyInstance) {
	serv.post('/internal/account/register', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { hashedPass } = request.body as { hashedPass: string };

			if (!username || !hashedPass)
				return (reply.code(400).send({ message: 'Missing username or hashedPass.' }));

			const usernameTaken = await checkUsernameUnique(serv.dbAccount ,username);
			if (usernameTaken) {
				return (reply.code(409).send({
					success: false,
					message: 'Username taken'
				}));
			}

			const query = `
				INSERT INTO usersAuth (hashedPassword, username, userStatus, registerDate)
				VALUES (?, ?, 1, ?)
			`;

			const params = [
				hashedPass,
				username,
				new Date().toISOString()
			];
			
			const resultCreateAccount = await serv.dbAccount.run(query, params);
			if (resultCreateAccount.changes === 0) {
				serv.log.error('User registration query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during registration.' }));
			}
		
			const queryGetID = `
				SELECT userID FROM usersAuth WHERE username = ?
			`

			const userID = await serv.dbAccount.get(queryGetID, username);
			if (!userID) {
				return (reply.code(404).send({
					success: false,
					message: 'Account not found'
				}));
			}
			
			const resultCreateProfile = await fetch(`https://users:2626/internal/users/createProfile/:userID/${userID}`);
			if (!resultCreateProfile) {
					return (reply.code(500).send({
					success: false,
					message: 'Could not created user profile'
				}));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Account registered and profile created!'
			}));

			} catch (error) {
				serv.log.error(`Error creating user account: ${error}`);
				return (reply.code(500).send({ message: 'Internal server error' }));
			}
	});

	serv.get('/internal/account/login', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			if (!username || !password)
				return (reply.code(400).send({ message: 'Missing username or hashedPass.' }));

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

	serv.post('/internal/account/updatePass', async(request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { password } = request.body as { password: string };

			if (!username || !password)
				return (reply.code(400).send({ message: 'Missing username or hashedPass.' }));

			const query = `
				UPDATE userAuth SET hashedPassword = ? WHERE username = ? 
			`

			const params = [
				password,
				username
			];

			const result = await serv.dbAccount.run(query, params);
			if (!result.changes) {
				return (reply.code(500).send({
				success: false,
				message: 'Could not update user password'
				}));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Password updated!'
			}));
		
		} catch (error) {
			serv.log.error(`Error when trying to login ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//TODO : internal ? handled by authentification ?
	serv.post('/internal/account/updateUsername/', async(request, reply) => {
		try {
			const userID = request.user.userID;
			const { newUsername, oldUsername } = request.body as { newUsername: string, oldUsername: string };
			
			if (!newUsername || !oldUsername)
				return (reply.code(400).send({ message: 'Missing username or hashedPass.' }));

			const query = `
				UPDATE userAuth SET username = ? WHERE userID = ? 
			`

			const params = [
				newUsername,
				userID
			];

			const result = await serv.dbAccount.run(query, params);
			if (!result.changes) {
				return (reply.code(500).send({
				success: false,
				message: 'Could not update username'
				}));
			}

			const response = await fetch(`https://users:2626/users/${userID}/username`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ newUsername: newUsername })
			});
			if (!response.ok) {
				serv.log.error(`Profile service failed. Rolling back auth change for userID: ${userID}`);
				const rollbackQuery = `UPDATE userAuth SET username = ? WHERE userID = ?`;
				await serv.dbAccount.run(rollbackQuery, [oldUsername, userID]);
				return (reply.code(500).send({
					success: false,
					message: 'Could not update username in profile service; original change has been rolled back.'
				}));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Username updated!'
			}));
		
		} catch (error) {
			serv.log.error(`Error when trying to login ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});
}
