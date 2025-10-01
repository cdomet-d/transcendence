import type { FastifyInstance } from 'fastify';
import { Database } from 'sqlite';
import { getUserID } from './friends.service.js';
import { checkUserExists } from './friends.service.js';
import { getPendingFriendRequests } from './friends.service.js'
import { getUserProfile } from './friends.service.js'

interface userData {
  userID: number;
  username: string;
}

export async function friendshipExistsUsersID(db: Database, userA_ID: number, userB_ID: number): Promise<boolean> {
    const query = `
        SELECT 1 FROM friendship 
        WHERE (userID = ? AND friendID = ?) 
           OR (userID = ? AND friendID = ?)
        LIMIT 1;
    `;
    
    const params = [userA_ID, userB_ID, userB_ID, userA_ID];
    const result = await db.get(query, params);

    // The '!!' converts the result (an object or undefined) to a boolean.
    return !!result;
}

export async function friendshipExistsFriendshipID(db: Database, friendshipID: number): Promise<boolean> {
	const query = `
		SELECT 1 FROM friendship 
		WHERE (friendshipID = ?) 
		LIMIT 1;
	`;

	const params = [friendshipID];
	const result = await db.get(query, params);

	return (!!result);
}

export async function friendRoutes(serv: FastifyInstance) {

	// Send a friend request to another user with username, parameter : username of sender and receiver
	serv.post('/friends/send-friends-requests/:username', async (request, reply) => {
		serv.log.info('in serv post friends container');
		try {
			const { username: receiverUsername } = request.params as { username: string };
			const { userId: senderId } = request.body as { userId: number };
			
			if (!senderId || !receiverUsername)
				return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });

			const receiverUser = await getUserID(receiverUsername);
			if (!receiverUser) {
				return reply.code(404).send({ message: `User '${receiverUsername}' not found` });
			}
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

			return reply.code(201).send({
				success: true,
				message: `Friend request sent to ${receiverUsername}`
			});

		} catch (error) {
			console.error('[Friends Service] Error processing friend request:', error);
			return reply.code(500).send({
			success: false,
			message: 'An internal error occurred.'
			});
		}
	});

	//accept a friend request
	serv.post('/friends/friends-request/:requestID', async (request, reply) => {
		try {
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
			` UPDATE friendship SET statusFrienship = true WHERE friendshipID = ?
			`;
			
			const result = await serv.dbFriends.run(query, [requestID]);

			return (reply.code(201).send({
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
	serv.post('/friends/:username', async (request, reply) => {
		try {
			const { username: friendUsername } = request.params as { username: string };
			const { userId: senderId } = request.body as { userId: number };
			
			if (!senderId || !friendUsername)
				return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });

			const usersResponse = await fetch(`http://users:2626/internal/users/by-username/${friendUsername}`);
			if (usersResponse.status === 404)
				return (reply.code(404).send({message: `User '${friendUsername}'`}));

			if (!usersResponse.ok)
				throw new Error('Users service returned an error');

			const receiverUser = (await usersResponse.json()) as userData;
			const receiverId = receiverUser.userID;

			const alreadyExists = await friendshipExistsUsersID(serv.dbFriends, senderId, receiverId);

			if (!alreadyExists) {
				return reply.code(409).send({
					success: false,
					message: 'Friendship doesnt exists!'
				});
			}

			serv.log.info('received users service response');

			const query = `
				DELETE FROM friendship 
				WHERE (userID = ? AND friendID = ?) 
				   OR (userID = ? AND friendID = ?);
			`;

			const params = [
				senderId,
				receiverId,
			];

			const result = await serv.dbFriends.run(query, params);

			serv.log.info(`A row has been delete with rowid ${result.lastID}`);

			return reply.code(201).send({
				success: true,
				message: `Friendship deleted`
			});

		} catch (error) {
			console.error('[Friends Service] Error processing friend request:', error);
			return reply.code(500).send({
			success: false,
			message: 'An internal error occurred.'
			});
		}
	});

	//return all pending friendship
	serv.get('/friends/friend-requestlist/:userID', async (request, reply) => {

	});

	//return all friendship
	serv.get('/friends/friendslist/:userID', async (request, reply) => {
	
	});

//TODO: do we really need all this information for the friend-request list ? How will the UI looks like ?
	serv.get('/friends/friend-request-list/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			// 1. Get the main user's ID from their username
		//	const mainUser = await checkUserExists(userID);
		//	if (!mainUser)
		//	    return (reply.code(404).send({ message: `User not found` }));

			// 2. Get all pending friend requests sent TO this user from the database
			const pendingRequests = await getPendingFriendRequests(serv.dbFriends, userID);

			if (pendingRequests.length === 0) {
				return reply.code(200).send([]); // Return empty array if no requests
			}

			// 3. For each pending request, fetch the full profile of the SENDER
			const profileCardPromises = pendingRequests.map(async (request) => {
				const senderProfile = await getUserProfile(request.senderID);
				if (!senderProfile)
					return (null); // Skip if a profile can't be fetched

				// 4. Format the data to match the required "profile card" structure
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
			});

			// Wait for all profile fetches to complete and filter out any nulls
			const profileCards = (await Promise.all(profileCardPromises))
								.filter(card => card !== null);

			return (reply.code(200).send(profileCards));

		} catch (error) {
			console.error('[Friends Service] Error fetching friend request list:', error);
			return (reply.code(500).send({ message: 'An internal error occurred.' }));
		}
	});
}


