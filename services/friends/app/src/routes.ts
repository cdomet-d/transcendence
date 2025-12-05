import type { FastifyInstance } from 'fastify';

import { getFriendship, friendshipExistsUsersID, getFriendshipPending } from './friends.service.js'
type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

interface JwtPayload {
	userID: number;
	username: string;
	iat: number;
	exp: number;
}

export async function routeFriend(serv: FastifyInstance) {
	//GET friendship?userA=1&userB=2
	serv.get('/friendship', async (request, reply) => {
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
				console.log("userA", query.userA);
				console.log("userB", query.userB);


				const sql = `
					SELECT statusFriendship FROM friendship 
					WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)
					LIMIT 1;
				`;
				const params = [query.userA, query.userB, query.userB, query.userA];
				const response = await serv.dbFriends.get<{ statusFriendship: string }>(
					sql,
					params
				);

				console.log("ersponse", JSON.stringify(response));
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
	serv.get('/friendlist', async (request, reply) => {
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
				const friends = await getFriendship(serv.dbFriends, query.userID);
				return reply.code(200).send(friends);
			}

			return reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' });
		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw error;
		}
	});

	serv.get('/friendlistpending', async (request, reply) => {
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
				const friends = await getFriendshipPending(serv.dbFriends, query.userID);
				return reply.code(200).send(friends);
			}

			return reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' });
		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw error;
		}
	});

	//create a pending friend request
	serv.post('/relation', async (request, reply) => {
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

			const query = `
				INSERT INTO friendship (userID, friendID, statusFriendship)
				VALUES (?, ?, ?)
			`;

			const params = [senderID, friendID, false];

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
	serv.patch('/relation', async (request, reply) => {
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

			const { senderRequestID: senderRequestID } = request.body as {
				senderRequestID: string;
			};
			const { friendID: friendID } = request.body as { friendID: string };

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

			const params = [friendshipID, senderRequestID];

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
	serv.delete('/relation', async (request, reply) => {
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
			console.log('HERE', friendID, removerID);
			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
					OR (userID = ? AND friendID = ?);
			`;
			const params = [removerID, friendID, friendID, removerID];
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
	serv.delete('/', async (request, reply) => {
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

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ?) 
					OR (friendID = ?);
			`;
			await serv.dbFriends.run(query, [userID, userID]);

			return reply.code(204).send();
		} catch (error) {
			serv.log.error(`[FRIENDS] Error deleting all friendships: ${error}`);
			throw error;
		}
	});
}
