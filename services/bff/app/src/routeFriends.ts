import type { FastifyInstance } from 'fastify';

import { findUserByUsername } from './bffFriends.service.js';
import { createFriendRequest } from './bffFriends.service.js';
import { acceptFriendRequest } from './bffFriends.service.js';
import { deleteFriendRequest } from './bffFriends.service.js';

export async function bffFriendRoutes(serv: FastifyInstance) {

	serv.post('/friends/sendrequest', async (request, reply) => {
		try {
			const senderID = request.user.userID;
			const senderUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply.code(400).send({ message: '[BFF] Missing friend username in request body.' });

			if (senderUsername === friendUsername)
				return reply.code(400).send({ message: '[BFF] You cannot send a friend request to yourself.' });

			const friendUser = await findUserByUsername(friendUsername);
			if (!friendUser)
				return reply.code(404).send({ message: `[BFF] User '${friendUsername}' not found.` });

			const friendsServiceResponse = await createFriendRequest(senderID, friendUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error sending friend request: ${error}`);
			return reply.code(503).send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});

	serv.patch('/friends/acceptrequest', async (request, reply) => {
		try {
			const receiverID = request.user.userID;
			const receiverUsername = request.user.username;

			const { username: senderRequestUsername } = request.body as { username: string };

			if (!senderRequestUsername)
				return reply.code(400).send({ message: '[BFF] Missing friend username in request body.' });

			if (senderRequestUsername === receiverUsername)
				return reply.code(400).send({ message: '[BFF] You cannot accept a friend request to yourself.' });

			const senderRequestUser = await findUserByUsername(senderRequestUsername);
			if (!senderRequestUser)
				return reply.code(404).send({ message: `[BFF] User '${senderRequestUsername}' not found.` });

			const friendsServiceResponse = await acceptFriendRequest(receiverID, senderRequestUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error accepting friend request: ${error}`);
			return reply.code(503).send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});

	serv.delete('/friends/deletefriendship', async (request, reply) => {
		try {
			const removerID = request.user.userID;
			const removerUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply.code(400).send({ message: '[BFF] Missing friend username in request body.' });

			if (friendUsername === removerUsername)
				return reply.code(400).send({ message: '[BFF] You cannot accept a friend request to yourself.' });

			const friendUser = await findUserByUsername(friendUsername);
			if (!friendUser)
				return reply.code(404).send({ message: `[BFF] User '${friendUsername}' not found.` });

			const friendsServiceResponse = await deleteFriendRequest(removerID, friendUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error deleting friend request: ${error}`);
			return reply.code(503).send({ message: '[BFF] A backend service is currently unavailable.' });
		}
	});
}



