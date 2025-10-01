import type { FastifyInstance } from 'fastify';

interface userData {
  userID: number;
  username: string;
}

export async function friendRoutes(serv: FastifyInstance) {

	//TODO : send a "friend request already send"
	// Send a friend request to another user with username, parameter : username of sender and receiver
	serv.post('/friends/friends-requests/:username', async (request, reply) => {
		serv.log.info('in serv post friends container');
		try {
			const { username: receiverUsername } = request.params as { username: string };
			const { userId: senderId } = request.body as { userId: number };
			
			if (!senderId || !receiverUsername)
				return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });

			const usersResponse = await fetch(`http://users:2626/internal/users/by-username/${receiverUsername}`);
			if (usersResponse.status === 404)
				return (reply.code(404).send({message: `User '${receiverUsername}'`}));

			if (!usersResponse.ok)
				throw new Error('Users service returned an error');

			const receiverUser = (await usersResponse.json()) as userData;
			const receiverId = receiverUser.userID;
			serv.log.info('received users service response');

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

			serv.log.info(`A row has been inserted with rowid ${result.lastID}`);

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


	serv.post('/friends/friends-request/:requestID', async (request, reply) => {
		try {
			const {requestID : requestID } = request.params as { requestID : number};

			if (!requestID)
				return (reply.code(404).send({message: `Friends request ID '${requestID}'`}));

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
}
