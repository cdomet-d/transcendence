import type { FastifyInstance } from 'fastify';

import { getUserID } from './friends.service.js';
import { getPendingFriendRequests } from './friends.service.js'
import { getFriendship } from './friends.service.js'
import { getUserProfile } from './friends.service.js'
import { friendshipExistsFriendshipID } from './friends.service.js'
import { friendshipExistsUsersID } from './friends.service.js'
//import { checkUserExists } from './friends.service.js';

interface userData {
  userID: number;
  username: string;
}

export async function friendRoutes(serv: FastifyInstance) {

	// Send a friend request to another user with username, parameter : username of sender and receiver
	serv.post('/internal/friends/send-friends-requests', async (request, reply) => {
		try {
			const senderId = request.user.userID;
			const { username: receiverUsername } = request.params as { username: string };
			
			if (!receiverUsername)
				return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });
			
			if (request.user.username === receiverUsername)
				return reply.code(400).send({ message: 'You cannot send a friend request to yourself.' });

			const receiverUser = await getUserID(receiverUsername);
			if (!receiverUser)
				return reply.code(404).send({ message: `User '${receiverUsername}' not found` });

			const receiverId = receiverUser.userID;

			const alreadyExists = await friendshipExistsUsersID(serv.dbFriends, senderId, receiverId);
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
				senderId,
				receiverId,
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
				message: `Friend request sent to ${receiverUsername}`
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
	serv.post('/internal/friends/friends-request/:requestID', async (request, reply) => {
		try {
			const currentUserId = request.user.userID;
			const {requestID : requestID } = request.params as { requestID : number};

			if (!requestID)
				return (reply.code(404).send({message: `Friends request ID '${requestID}'`}));

			const alreadyExists = await friendshipExistsFriendshipID(serv.dbFriends, requestID);

			if (!alreadyExists) {
				return reply.code(409).send({
					success: false,
					message: 'Friendship doesnt exists!'
				});
			}

			const query = 
			`UPDATE friendship SET statusFrienship = true WHERE friendshipID = ? AND friendID = ?
			`;
			
			const params =
				[requestID,
				currentUserId];
			
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
	serv.delete('/internal/friends/:username', async (request, reply) => {
		try {
			const removerId = request.user.userID;
			const { username: friendUsername } = request.params as { username: string };

			const friendUser = await getUserID(friendUsername);
			if (!friendUser)
				return (reply.code(404).send({ message: `User '${friendUsername}' not found.` }));

			const friendId = friendUser.userID;
		
			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
					OR (userID = ? AND friendID = ?);
			`;
			const params = [removerId, friendId, friendId, removerId];
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


	//return all friendship
	serv.get('/internal/friends/friendslist', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const pendingRequests = await getFriendship(serv.dbFriends, userID);
			if (pendingRequests.length === 0)
				return reply.code(200).send([]); // Return empty array if no requests

			const profileCardPromises = pendingRequests.map(async (request) => {
				try {
					const senderProfile = await getUserProfile(request.otherUserID);
					if (!senderProfile)
						return (null); // Skip if a profile can't be fetched
					return {
						avatar: senderProfile.avatar,
						biography: senderProfile.biography,
						friendship: {
							friendsSince: request.startTime, 
						},
						profileColor: senderProfile.profileColor,
						rank: senderProfile.rank,
						username: senderProfile.username
					};
		} catch (error) {
			console.error(`Failed to fetch profile for user ${request.otherUserID}:`, error);
			return (null); // Return null on error so it gets filtered out
		}
	});

		const profileCards = (await Promise.all(profileCardPromises))
							.filter(card => card !== null);

		return (reply.code(200).send(profileCards));

		} catch (error) {
			console.error('[Friends Service] Error fetching friend request list:', error);
			return (reply.code(500).send({ message: 'An internal error occurred.' }));
		}
	});

	//TODO: do we really need all this information for the friend-request list ? How will the UI looks like ?
	//return all pending friendship
	serv.get('/internal/friends/friend-request-list', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const pendingRequests = await getPendingFriendRequests(serv.dbFriends, userID);
			if (pendingRequests.length === 0)
				return reply.code(200).send([]); // Return empty array if no requests

			const profileCardPromises = pendingRequests.map(async (request) => {
				try {
					const senderProfile = await getUserProfile(request.otherUserID);
					if (!senderProfile)
						return (null); // Skip if a profile can't be fetched
					return {
						avatar: senderProfile.avatar,
						biography: senderProfile.biography,
						friendship: {
							friendsSince: request.startTime, 
						},
						profileColor: senderProfile.profileColor,
						rank: senderProfile.rank,
						username: senderProfile.username
					};
				} catch (error) {
					console.error(`Failed to fetch profile for user ${request.otherUserID}:`, error);
					return (null); // Return null on error so it gets filtered out
				}
			});

			// Wait for all profile fetches to complete and filter out any nulls
			const profileCards = (await Promise.all(profileCardPromises))
								.filter(card => card !== null);

			console.log("returning processed profile card");
			return (reply.code(200).send(profileCards));

		} catch (error) {
			console.error('[Friends Service] Error fetching friend request list:', error);
			return (reply.code(500).send({ message: 'An internal error occurred.' }));
		}
	});
}
