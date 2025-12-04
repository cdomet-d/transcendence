import type { FastifyInstance } from 'fastify';
import type { JwtPayload } from './bff.interface.js';
import { fetchUserID, fetchFriendships } from './bffUserProfile.service.js';
import { createFriendRequest, deleteFriendRequest, acceptFriendRequest } from './bffFriends.service.js';
import { type NatsConnection, StringCodec } from 'nats';

declare module 'fastify' {
	interface FastifyInstance {
		nats: NatsConnection;
	}
}

export async function bffFriendRoutes(serv: FastifyInstance) {

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

			const senderID = request.user.userID;
			const senderUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply
					.code(400)
					.send({ message: '[BFF] Missing friend username in request body.' });

			if (senderUsername === friendUsername)
				return reply
					.code(400)
					.send({ message: '[BFF] You cannot send a friend request to yourself.' });

			const friendUserID = await fetchUserID(serv.log, friendUsername, token);
			if (!friendUserID)
				return reply.code(404).send({ message: `[BFF] User '${friendUsername}' not found.` });

			await createFriendRequest(serv.log, senderID, friendUserID, token);
			try {

				const eventPayload = {
					type: 'FRIEND_REQUEST',
					senderUsername: senderUsername,
					receiverID: friendUserID,
				};
				console.log('nats published !');
				serv.nats.publish('post.notif', StringCodec().encode(JSON.stringify(eventPayload)));
				serv.log.error(`[NATS] Published friend request notification for user ${friendUserID}`);
			} catch (natsError) {
				serv.log.error(`[NATS] Failed to publish notification: ${natsError}`);
			}
			return (reply
				.code(201)
				.send({ message: '[BFF] Friend request sent.' }));

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				return reply.code(customError.code).send({ message: customError.message });
			}
			serv.log.error(`[BFF] Error sending friend request: ${error}`);
			return reply.code(503).send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});

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

			const receiverID = request.user.userID;
			const receiverUsername = request.user.username;

			const { username: senderRequestUsername } = request.body as { username: string };

			if (!senderRequestUsername)
				return reply
					.code(400)
					.send({ message: '[BFF] Missing friend username in request body.' });

			if (senderRequestUsername === receiverUsername)
				return reply
					.code(400)
					.send({ message: '[BFF] You cannot accept a friend request to yourself.' });

			const senderRequestUserID = await fetchUserID(serv.log, senderRequestUsername, token);
			if (!senderRequestUserID)
				return reply
					.code(404)
					.send({ message: `[BFF] User '${senderRequestUsername}' not found.` });

			await acceptFriendRequest(serv.log, receiverID, senderRequestUserID, token);
			return reply.code(200).send({ message: '[BFF] Friend request accepted.' });
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				return reply.code(customError.code).send({ message: customError.message });
			}
			serv.log.error(`[BFF] Error accepting friend request: ${error}`);
			return reply
				.code(503)
				.send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});

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
					} else
						return reply.code(401).send({ message: 'Unknown error' });
				}
			}

			const removerID = request.user.userID;
			const removerUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply
					.code(400)
					.send({ message: '[BFF] Missing friend username in request body.' });

			if (friendUsername === removerUsername)
				return reply.code(400).send({ message: '[BFF] You cannot delete a friendship with yourself.' });

			const friendUserID = await fetchUserID(serv.log, friendUsername, token);
			if (!friendUserID)
				return reply.code(404).send({ message: `[BFF] User '${friendUsername}' not found.` });

			await deleteFriendRequest(serv.log, removerID, friendUserID, token);
			return (reply
				.code(200)
				.send({ message: '[BFF] Friendship deleted.' }));

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				return reply.code(customError.code).send({ message: customError.message });
			}
			serv.log.error(`[BFF] Error deleting friend request: ${error}`);
			return reply.code(503).send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});

	serv.get('/relation', async (request, reply) => {
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
					} else
						return reply.code(401).send({ message: 'Unknown error' });
				}
			}

			const userID = request.user.userID;

			const response = await fetchFriendships(serv.log, userID, 'pending', token);

			return (reply
				.code(200)
				.send({
					success: true,
					body: JSON.stringify(response)
				}));


		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };
				if (customError.code === 404) return (reply.code(404).send({ message: 'User profile data not found.' }));
				if (customError.code === 401) return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
				if (customError.code === 400) return reply.code(400).send({ code: error.code, message: 'Unauthaurized' });

				serv.log.error(`[BFF] Error building user profile view: ${error}`);
				throw (error);
			}
		}

	});
}
