import type { FastifyInstance } from 'fastify';

interface userData {
  userID: number;
  username: string;
}

export async function friendRoutes(serv: FastifyInstance) {

	serv.post('/user/friends-requests/:username', async (request, reply) => {
		try {
			const { username: receiverUsername } = request.params as { username: string };
			const { userId: senderId } = request.body as { userId: number };
			
			if (!senderId || !receiverUsername)
				return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });

			const usersResponse = await fetch(`http://users:2626/internal/users/by-username/${receiverUsername}`);
			if (usersResponse.status === 404) {
				return (reply.code(404).send({message: `User '${receiverUsername}'`}));
			}

			if (!usersResponse.ok)
				throw new Error('Users service returned an error');

			const receiverUser = (await usersResponse.json()) as userData;
			const receiverId = receiverUser.userID;

			 const query = `
				INSERT INTO friendship (friendshipID, userID, friendID, startTimeFriendship, statusFrienship)
				VALUES (?, ?, ?, ?, ?)
			`;

			const params = [
				null,
				senderId,
				receiverId,
				new Date().toISOString(),
				false
			];

			await new Promise<void>((resolve, reject) => {
				serv.dbFriends.run(query, params, function(err) {
					if (err) {
						serv.log.error(`SQL Error: ${err.message}`);
						reject(new Error('Failed to create friend request in database.'));
						return ;
					}
					serv.log.info(`A row has been inserted with rowid ${this.lastID}`);
					resolve();
				});
			});

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
}
