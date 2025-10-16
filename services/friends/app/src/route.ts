import type { FastifyInstance } from 'fastify';

import { getPendingFriendRequests } from './friends.service.js'
import { getFriendship } from './friends.service.js'
import { friendshipExistsUsersID } from './friends.service.js'

export async function routeFriend(serv: FastifyInstance) {

	// Send a friend request to another user with username, parameter : username of sender and receiver
	serv.post('/internal/friends/sendrequest', async (request, reply) => {
		try {
			const { senderID: senderID } = request.body as { senderID: number };
			const { friendID: friendID } = request.body as { friendID: number };

			const alreadyExists = await friendshipExistsUsersID(serv.dbFriends, senderID, friendID);
			if (alreadyExists) {
				return reply.code(409).send({
					success: false,
					message: 'Friendship already exists!'
				});
			}

			const query = `
				INSERT INTO friendship (userID, friendID, startTimeFriendship, statusFrienship)
				VALUES (?, ?, ?, ?)
			`;

			const params = [
				senderID,
				friendID,
				new Date().toISOString(),
				false
			];

			const result = await serv.dbFriends.run(query, params);
			if (result.changes === 0) {
				return reply.code(404).send({
					success: false,
					message: 'Friend request could not be sent.'
				});
			}
			return (reply.code(201).send({
				success: true,
				message: `Friend request sent to ${friendID}`
			}));

		} catch (error) {
			console.error('[Friends Service] Error processing friend request:', error);
			return reply.code(500).send({
				success: false,
				message: 'An internal error occurred.'
			});
		}
	});

	//accept a friend request
	serv.post('/internal/friends/acceptrequest', async (request, reply) => {
		try {
			const { receiverID: receiverID } = request.body as { receiverID: number };
			const { friendID: friendID } = request.body as { friendID: number };

			const friendshipID = await friendshipExistsUsersID(serv.dbFriends, receiverID, friendID);
			if (!friendshipID) {
				return reply.code(409).send({
					success: false,
					message: 'Friendship doesnt exists!'
				});
			}

			const query =
				`UPDATE friendship SET statusFrienship = true WHERE friendshipID = ? AND friendID = ?
			`;

			const params =
				[friendshipID,
					receiverID];

			const result = await serv.dbFriends.run(query, params);
			if (result.changes === 0) {
				return reply.code(404).send({
					success: false,
					message: 'Friendship could not be accepted.'
				});
			}

			return (reply.code(200).send({
				success: true,
				message: `Friendship accepted !`
			}));

		} catch (error) {
			console.error('[Friend service] Error accepting friend request', error);
			return (reply.code(500).send({
				success: false,
				message: 'An internal error occured.'
			}));
		}
	});

	//delete a frienship
	serv.delete('/internal/friends/deletefriendship', async (request, reply) => {
		try {
			const { removerId: removerId } = request.body as { removerId: number };
			const { friendID: friendID } = request.body as { friendID: number };

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
					OR (userID = ? AND friendID = ?);
			`;

			const params = [removerId, friendID, friendID, removerId];
			const result = await serv.dbFriends.run(query, params);

			if (result.changes === 0)
				return (reply.code(404).send({ message: 'Friendship not found.' }));

			return (reply.code(200).send({
				success: true,
				message: `Friendship deleted !`
			}));

		} catch (error) {
			serv.log.error(`[Friends Service] Error deleting friendship: ${error}`);
			return (reply.code(500).send({
				success: false,
				message: 'An internal error occured.'
			}));
		}
	});

	serv.get('/internal/users/:userID/friendslist', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const friends = await getFriendship(serv.dbFriends, userID);
			return reply.code(200).send(friends);

		} catch (error) {
			serv.log.error(`[Friends Service] Error fetching friends list: ${error}`);
			return reply.code(500).send({ message: 'Internal server error.' });
		}
	});

	serv.get('/internal/users/:userID/friendrequests', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const requests = await getPendingFriendRequests(serv.dbFriends, userID);
			return reply.code(200).send(requests);

		} catch (error) {
			serv.log.error(`[Friends Service] Error fetching friend request list: ${error}`);
			return reply.code(500).send({ message: 'Internal server error.' });
		}
	});
}
