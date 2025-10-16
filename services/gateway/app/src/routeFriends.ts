import type { FastifyInstance } from 'fastify';
import type { FriendProfileCard } from './gateway.interface.js';

import { findUserByUsername } from './gatewayFriends.service.js';
import { createFriendRequest } from './gatewayFriends.service.js';
import { acceptFriendRequest } from './gatewayFriends.service.js';
import { deleteFriendRequest } from './gatewayFriends.service.js';
import { fetchRawFriends } from './gatewayFriends.service.js';
import { fetchRawFriendRequests } from './gatewayFriends.service.js';
import { fetchUserProfiles } from './gatewayFriends.service.js';

export async function gatewayFriendRoutes(serv: FastifyInstance) {

	serv.post('/friends/sendrequest', async (request, reply) => {
		try {
			const senderID = request.user.userID;
			const senderUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply.code(400).send({ message: 'Missing friend username in request body.' });

			if (senderUsername === friendUsername)
				return reply.code(400).send({ message: 'You cannot send a friend request to yourself.' });

			const friendUser = await findUserByUsername(friendUsername);
			if (!friendUser)
				return reply.code(404).send({ message: `User '${friendUsername}' not found.` });

			const friendsServiceResponse = await createFriendRequest(senderID, friendUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[API Gateway] Error sending friend request: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });
		}
	});

	serv.patch('/friends/acceptrequest', async (request, reply) => {
		try {
			const receiverID = request.user.userID;
			const receiverUsername = request.user.username;

			const { username: senderRequestUsername } = request.body as { username: string };

			if (!senderRequestUsername)
				return reply.code(400).send({ message: 'Missing friend username in request body.' });

			if (senderRequestUsername === receiverUsername)
				return reply.code(400).send({ message: 'You cannot accept a friend request to yourself.' });

			const senderRequestUser = await findUserByUsername(senderRequestUsername);
			if (!senderRequestUser)
				return reply.code(404).send({ message: `User '${senderRequestUsername}' not found.` });

			const friendsServiceResponse = await acceptFriendRequest(receiverID, senderRequestUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[API Gateway] Error accepting friend request: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });
		}
	});

	serv.delete('/friends/deletefriendship', async (request, reply) => {
		try {
			const removerID = request.user.userID;
			const removerUsername = request.user.username;

			const { username: friendUsername } = request.body as { username: string };

			if (!friendUsername)
				return reply.code(400).send({ message: 'Missing friend username in request body.' });

			if (friendUsername === removerUsername)
				return reply.code(400).send({ message: 'You cannot accept a friend request to yourself.' });

			const friendUser = await findUserByUsername(friendUsername);
			if (!friendUser)
				return reply.code(404).send({ message: `User '${friendUsername}' not found.` });

			const friendsServiceResponse = await deleteFriendRequest(removerID, friendUser.userID);
			return (reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json()));

		} catch (error) {
			serv.log.error(`[API Gateway] Error deleting friend request: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });
		}
	});

	serv.get('/friends/friendlist', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const friends = await fetchRawFriends(userID);
			if (friends.length === 0)
				return (reply.code(200).send([]));

			const friendIDs = friends.map(friend => friend.otherUserID);
			const profiles = await fetchUserProfiles(friendIDs);
			const profilesMap = new Map(profiles.map(p => [p.userID, p]));

			const friendCards = friends.map((friend): FriendProfileCard | null => {
				const profile = profilesMap.get(friend.otherUserID);
				if (!profile)
					return (null);

				return {
					username: profile.username,
					avatar: profile.avatar,
					biography: profile.biography,
					friendship: {
						friendsSince: friend.startTime,
					},
				};
			}).filter((card): card is FriendProfileCard => card !== null);

			return (reply.code(200).send(friendCards));

		} catch (error) {
			serv.log.error(`[API Gateway] Error fetching friends list: ${error}`);
			return (reply.code(503).send({ message: 'A backend service is currently unavailable.' }));
		}
	});

	serv.get('/friends/requestlist', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const requests = await fetchRawFriendRequests(userID);
			if (requests.length === 0)
				return (reply.code(200).send([]));

			const senderIDs = requests.map(req => req.otherUserID);
			const profiles = await fetchUserProfiles(senderIDs);
			const profilesMap = new Map(profiles.map(p => [p.userID, p]));

			const requestCards = requests.map((request): FriendProfileCard | null => {
				const profile = profilesMap.get(request.otherUserID);
				if (!profile)
					return (null);
				return {
					username: profile.username,
					avatar: profile.avatar,
					biography: profile.biography,
					friendship: {
						friendsSince: request.startTime,
					}
				}
			}).filter((card): card is FriendProfileCard => card !== null);

			return (reply.code(200).send(requestCards));

		} catch (error) {
			serv.log.error(`[API Gateway] Error fetching friend request list: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });
		}
	});
}



