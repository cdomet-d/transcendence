import type { FastifyInstance } from 'fastify';
import { getPendingFriendRequests, getFriendship, friendshipExistsUsersID } from './friends.service.js'
type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

export async function routeFriend(serv: FastifyInstance) {

	//GET hips?userA=1&userB=2
	//TODO : separate route in two 1. get relation betweem two users // "/" ---> to test 
	//							   2. get frienlist					 //	"/friend-list"
	serv.get('/friendship', async (request, reply) => {
		try {

			const query = request.query as {
				userA?: number,
				userB?: number,
				userID?: number,
				status?: 'friend' | 'pending'
			};

			//get relationship between two user
			if (query.userA && query.userB) {

				const sql = `
					SELECT statusFrienship FROM friendship 
					WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)
					LIMIT 1;
				`;
				const params = [query.userA, query.userB, query.userB, query.userA];
				const response = await serv.dbFriends.get<{ statusFrienship: boolean }>(sql, params);

				let status: ProfileView = 'stranger';
				if (!response?.statusFrienship)
					return (reply.code(404).send({ success: false, message: 'YOOOOO [FRIENDS] Friendship not found' }));
				if (response)
					status = response.statusFrienship ? 'friend' : 'pending';
				return (reply.code(200).send({ status: status }));
			}

			//get friends list
			if (query.userID && query.status) {
				if (query.status === 'friend') {
					const friends = await getFriendship(serv.dbFriends, query.userID);
					return (reply.code(200).send(friends));
				}
				if (query.status === 'pending') {
					const requests = await getPendingFriendRequests(serv.dbFriends, query.userID);
					return (reply.code(200).send(requests));
				}
			}

			return (reply.code(400).send({ message: '[FRIENDS] Invalid query parameters.' }));

		} catch (error) {
			serv.log.error(`[FRIENDS] Error checking relationship: ${error}`);
			throw (error);
		}
	});

	//create a pending friend request
	serv.post('/relation', async (request, reply) => {
		try {
			const { senderID: senderID } = request.body as { senderID: number };
			const { friendID: friendID } = request.body as { friendID: number };

			const alreadyExists = await friendshipExistsUsersID(serv.dbFriends, senderID, friendID);
			if (alreadyExists) {
				return reply.code(409).send({
					success: false,
					message: '[FRIENDS] Friendship already exists!'
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

			const response = await serv.dbFriends.run(query, params);
			if (response.changes === 0)
				throw new Error('[FRIENDS] Friend request failed to save.');
			return (reply.code(201).send({
				success: true,
				message: `[FRIENDS] Friend request sent to ${friendID}`
			}));

		} catch (error) {
			console.error('[FRIENDS] Error processing friend request:', error);
			throw (error);
		}
	});

	//accept a friend request
	serv.patch('/relation', async (request, reply) => {
		try {
			const { receiverID: receiverID } = request.body as { receiverID: number };
			const { friendID: friendID } = request.body as { friendID: number };

			const friendshipID = await friendshipExistsUsersID(serv.dbFriends, receiverID, friendID);
			if (!friendshipID) {
				return reply.code(404).send({
					success: false,
					message: '[FRIENDS] Friendship doesnt exists!'
				});
			}

			const query =
				`UPDATE friendship SET statusFrienship = true WHERE friendshipID = ? AND friendID = ?
			`;

			const params =
				[friendshipID,
					receiverID];

			const response = await serv.dbFriends.run(query, params);
			if (response.changes === 0) {
				return reply.code(400).send({
					success: false,
					message: '[FRIENDS] Friendship could not be accepted.'
				});
			}

			return (reply.code(200).send({
				success: true,
				message: `[FRIENDS] Friendship accepted !`
			}));

		} catch (error) {
			console.error('[FRIENDS] Error accepting friend request', error);
			throw (error);
		}
	});

	//Delete a relation between users
	serv.delete('/relation', async (request, reply) => {
		try {
			const { userA: userA } = request.body as { userA: number };
			const { userB: userB } = request.body as { userB: number };

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
					OR (userID = ? AND friendID = ?);
			`;
			const params = [userA, userB, userB, userA];
			const response = await serv.dbFriends.run(query, params);

			if (response.changes === 0)
				return (reply.code(404).send({ message: '[FRIENDS] Friendship not found.' }));

			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[FRIENDS] Error deleting friendship: ${error}`);
			throw (error);
		}
	});

	//delete all friendship a user is a part of

	serv.delete('/', async (request, reply) => {
		try {
			//TODO: get JWT from cookies when JWT plugins is register in fastify request.cookies.token as {userID: string}
			// Conversion might be needed to use the userID before using (probably in the plugin already)
			const { userID } = request.params as { userID: string };

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ?) 
					OR (friendID = ?);
			`
			await serv.dbFriends.run(query, [userID, userID]);

			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[FRIENDS] Error deleting all friendships: ${error}`);
			throw (error);
		}
	});
};
