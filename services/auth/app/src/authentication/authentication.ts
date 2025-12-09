import { deleteAccount, createUserProfile, checkUsernameUnique } from './auth.service.js';
import { clearCookie, setCookie, validateBearerToken, verifyPasswordMatch } from './auth.service.js';
import * as bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import type { JwtPayload } from './auth.interfaces.js';
import * as schema from './schemas.js';

//TODO update user status on login and logout
export async function authenticationRoutes(serv: FastifyInstance) {
	serv.get('/status', async (request, reply) => {
		const token = request.cookies.token;
		if (!token) {
			serv.log.error('Unauthorized: Token not found');
			return reply.code(401).send({ message: 'Unauthorized - token not found' });
		}
		if (token) {
			try {
				const user: JwtPayload = await request.jwtVerify();
				return reply.code(200).send({ username: user.username, userID: user.userID });
			} catch (error) {
				serv.log.error('Unauthorized: invalid token');
				return reply.code(401).send({ message: 'Unauthorized - invalid token' });
			}
		}
	});

	serv.post('/login', { schema: schema.auth }, async (request, reply) => {
		try {
			const { username, password } = request.body as { username: string; password: string };
			const account = await verifyPasswordMatch(serv, username, password);

			if (account === 404 || typeof account !== 'object') return reply.code(404).send({ message: '[AUTH] Account not found.' });
			if (account === 401) return reply.code(401).send({ message: '[AUTH] Invalid credentials.' });
			const tokenPayload = { userID: account.userID, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			// setCookie(reply, token);
			reply.setCookie('token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				path: '/',
				maxAge: 60 * 60 * 1000,
			});
			// serv.log.warn(`COOKIES: ${reply.cookies.token}`);
			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[AUTH] An unexpected error occurred while login: ${error}`);
			throw error;
		}
	});

	serv.post('/regen-jwt', { schema: schema.regen }, async (request, reply) => {
		try {
			const { username, userID } = request.body as { username: string; userID: string };

			if (!validateBearerToken(serv, request.headers.authorization)) return reply.code(401).send({ message: '[AUTH] Unauthorized.' });
			clearCookie(reply);
			const tokenPayload = { userID: userID, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			return reply.code(200).send({ token: token });
		} catch (error) {
			serv.log.error(`[AUTH] An unexpected error occurred while login: ${error}`);
			throw error;
		}
	});

	serv.post('/logout', async (request, reply) => {
		clearCookie(reply);
		return reply.code(200).send({ message: 'Success' });
	});

	serv.post('/verify', { schema: schema.verify }, async (request, reply) => {
		try {
			const { password } = request.body as { password: string };
			serv.log.warn(`[/verify]: ${request.user.username}`);
			const account = await verifyPasswordMatch(serv, request.user.username, password);

			if (account === 404) return reply.code(404).send({ message: '[AUTH] Account not found.' });
			if (account === 401) return reply.code(401).send({ message: '[AUTH] Invalid credentials.' });
			if (typeof account === 'object') {
				const tokenPayload = {
					userID: account.userID,
					username: request.user.username,
					action: true,
				};
				const token = serv.jwt.sign(tokenPayload, { expiresIn: '5m' });
				return reply.code(200).send({ token: token });
			}
		} catch (error) {
			serv.log.error(`[AUTH] An unexpected error occurred while verifying password: ${error}`);
			throw error;
		}
	});

	serv.post('/register', { schema: schema.auth }, async (request, reply) => {
		let newAccountId: string | null = null;
		try {
			const { username, password } = request.body as { username: string; password: string };

			if (!username || !password) return reply.code(400).send({ message: '[AUTH] Missing username or password.' });

			const hashedPassword = await bcrypt.hash(password, 12);

			const usernameTaken = await checkUsernameUnique(serv.dbAuth, username);
			if (usernameTaken) return reply.code(409).send({ message: 'Username taken' });

			const query = `
				INSERT INTO account (userID, hashedPassword, username)
				VALUES (?, ?, ?)
			`;
			newAccountId = crypto.randomUUID().toString();
			const params = [newAccountId, hashedPassword, username];
			const account = await serv.dbAuth.run(query, params);

			if (account.changes === 0 || !account.lastID) throw new Error('[AUTH] Failed to create account record.');

			const usersResponse = createUserProfile(serv.log, newAccountId, username);
			if ((await usersResponse).errorCode === `conflict`) return reply.code(409).send({ message: 'UserID taken' });

			const tokenPayload = { userID: newAccountId, username: username };
			const token = serv.jwt.sign(tokenPayload, { expiresIn: '1h' });
			switch ((await usersResponse).errorCode) {
				case 'success':
					setCookie(reply, token);
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
					return reply.code(404).send({
						message: '[AUTH] User not created and matching account not deleted',
					});
			}
			throw error;
		}
	});

	//TODO delete users/friends
	serv.delete('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `DELETE FROM account WHERE userID = ?`;

			const result = await serv.dbAuth.run(query, [userID]);
			if (!result.changes) return reply.code(404).send({ message: '[AUTH] Account not found' });
			return reply.code(204).send();
		} catch (error) {
			serv.log.error(`[AUTH] Error deleting account: ${error}`);
			throw error;
		}
	});

	serv.patch('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const body = request.body as { [key: string]: any };

			const dbUpdates: { [key: string]: any } = {};

			if (body.username && body.username !== '') dbUpdates.username = body.username;

			if (body.password && body.password !== '') {
				const hashedPassword = await bcrypt.hash(body.password, 12);
				dbUpdates.hashedPassword = hashedPassword;
			}

			if (body.defaultLang && body.defaultLang !== '') dbUpdates.defaultLang = body.defaultLang;

			const keysToUpdate = Object.keys(dbUpdates);
			if (keysToUpdate.length === 0) {
				return reply.code(400).send({
					success: false,
					message: '[AUTH] No valid fields provided for update.',
				});
			}

			const setClauses = keysToUpdate.map((key) => `${key} = ?`).join(', ');
			const params = keysToUpdate.map((key) => dbUpdates[key]);
			params.push(userID);

			const query = `
				UPDATE account SET ${setClauses} WHERE userID = ?
			`;

			const response = await serv.dbAuth.run(query, params);

			if (response.changes === 0) {
				return reply.code(404).send({
					success: false,
					message: '[AUTH] Account not found',
				});
			}

			return reply.code(200).send({
				success: true,
				message: '[AUTH] Account updated successfully!',
			});
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && ((error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE' || (error as { code: string }).code === 'SQLITE_CONSTRAINT'))
				return reply.code(409).send({ success: false, message: '[AUTH] This username is already taken.' });
			serv.log.error(`[AUTH] Error updating account: ${error}`);
			throw error;
		}
	});
}
