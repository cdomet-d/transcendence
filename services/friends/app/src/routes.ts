import type { FastifyInstance } from 'fastify';
import { getFriendListSchema, getPendingListSchema, getFriendshipStatusSchema, postRelationSchema, patchRelationSchema, deleteAllRelationsSchema, deleteRelationSchema } from './schemas.js';
import { getFriendship, friendshipExistsUsersID, getFriendshipPending } from './friends.service.js'
import { cleanInput } from './sanitizer.js';

type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

interface JwtPayload {
	userID: number;
	username: string;
	iat: number;
	exp: number;
}

export async function routeFriend(serv: FastifyInstance) {
	//GET friendship?userA=1&userB=2
	serv.get('/friendship', { schema: schema.getFriendshipStatusSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const query = request.query as {
				userA?: string;
				userB?: string;
			};

			if (query.userA && query.userB) {
				const safefuserA = cleanInput(query.userA);
				const safefuserB = cleanInput(query.userB);

				const sql = `
					SELECT statusFriendship FROM friendship 
					WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)
					LIMIT 1;
				`;
				const params = [safefuserA, safefuserB, safefuserB, safefuserA];
				const response = await serv.dbFriends.get<{ statusFriendship: string }>(
					sql,
					params
				);

				if (!response) return reply.code(200).send({ status: 'stranger' });

				const isFriend =
					String(response.statusFriendship) === 'true' ||
					String(response.statusFriendship) === '1';

				const status: ProfileView = isFriend ? 'friend' : 'pending';

				return reply.code(200).send({ status: status });
			}

			return reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' });
		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw error;
		}
	});

	//GET friendlist?userID=1
	serv.get('/friendlist', { schema: schema.getFriendListSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const query = request.query as {
				userID?: string;
			};

			if (query.userID) {
				const safefuserID = cleanInput(query.userID);
				const friends = await getFriendship(serv.dbFriends, safefuserID);
				return reply.code(200).send(friends);
			}

			return reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' });
		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw error;
		}
	});

	serv.get('/friendlistpending', { schema: schema.getFriendshipPending }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return (reply.code(400).send({ code: error.code, message: error.message }));
						return (reply.code(401).send({ code: error.code, message: 'Unauthaurized' }));
					} else
						return (reply.code(401).send({ message: 'Unknown error' }));
				}
			}

			const query = request.query as {
				userID?: string;
			};

			if (query.userID) {
				const safefuserID = cleanInput(query.userID);
				const friends = await getFriendshipPending(serv.dbFriends, safefuserID);
				return reply.code(200).send(friends);
			}

			return reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' });
		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw error;
		}
	});

	//create a pending friend request
	serv.post('/relation', async { schema: schema.postRelationSchema }, (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { senderID: senderID } = request.body as { senderID: string };
			const { friendID: friendID } = request.body as { friendID: string };
			const safefsenderID = cleanInput(senderID);
			const safefriendID = cleanInput(friendID);

			const query = `
				INSERT INTO friendship (userID, friendID, statusFriendship)
				VALUES (?, ?, ?)
			`;

			const params = [safefsenderID, safefriendID, false];

			const response = await serv.dbFriends.run(query, params);
			if (response.changes === 0)
				throw new Error('[FRIENDS] Friend request failed to save.');

			return (reply.code(201).send({
				success: true,
				message: `[FRIENDS] Friend request sent to ${friendID}`
			}));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error &&
				((error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE' || (error as { code: string }).code === 'SQLITE_CONSTRAINT'))
				return reply.code(409).send({
					success: false,
					message: '[FRIENDS] Friendship already exists!'
				});
			console.error('[FRIENDS] Error processing friend request:', error);
			throw (error);
		}
	});

	//accept a friend request
	serv.patch('/relation', { schema: schema.patchRelationSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { senderRequestID: senderRequestID } = request.body as {senderRequestID: string;};
			const { friendID: friendID } = request.body as { friendID: string };

			const safesenderRequestID = cleanInput(senderRequestID);
			const safefriendID = cleanInput(friendID);


			const friendshipID = await friendshipExistsUsersID(
				serv.dbFriends,
				senderRequestID,
				friendID
			);
			if (!friendshipID) {
				return reply.code(404).send({
					success: false,
					message: '[FRIENDS] Friendship doesnt exists!',
				});
			}

			const query = `UPDATE friendship SET statusFriendship = true WHERE friendshipID = ? AND friendID = ?
			`;

			const params = [safefriendID, safesenderRequestID];

			const response = await serv.dbFriends.run(query, params);
			if (response.changes === 0) {
				return reply.code(400).send({
					success: false,
					message: '[FRIENDS] Friendship could not be accepted.',
				});
			}

			return reply.code(200).send({
				success: true,
				message: `[FRIENDS] Friendship accepted !`,
			});
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message?: string };
				if (customError.code === 409) {
					return reply.code(409).send({
						success: false,
						message: customError.message || '[FRIENDS] Friendship already accepted!',
					});
				}
			}
			console.error('[FRIENDS] Error accepting friend request', error);
			throw error;
		}
	});

	//Delete a relation between users
	serv.delete('/relation', { schema: schema.deleteRelationSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { removerID: removerID } = request.body as { removerID: string };
			const { friendID: friendID } = request.body as { friendID: string };
			const saferemoverID = cleanInput(removerID);
			const safefriendID = cleanInput(friendID);

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
					OR (userID = ? AND friendID = ?);
			`;
			const params = [saferemoverID, safefriendID, safefriendID, saferemoverID];
			const response = await serv.dbFriends.run(query, params);

			if (response.changes === 0)
				return reply.code(404).send({ message: '[FRIENDS] Friendship not found.' });

			return reply.code(204).send();
		} catch (error) {
			serv.log.error(`[FRIENDS] Error deleting friendship: ${error}`);
			throw error;
		}
	});

	//delete all friendship a user is a part of
	serv.delete('/', { schema: schema.deleteAllRelationsSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const safeUserID = cleanInput(userID);

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ?) 
					OR (friendID = ?);
			`;
			await serv.dbFriends.run(query, [safeUserID, safeUserID]);

			return reply.code(204).send();
		} catch (error) {
			serv.log.error(`[FRIENDS] Error deleting all friendships: ${error}`);
			throw error;
		}
	});
}
