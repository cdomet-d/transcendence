import type { FastifyInstance } from 'fastify';

interface UserData {
	userID: number;
	username: string;
}

async function findUserByUsername(username: string): Promise<UserData | null> {
	const response = await fetch(`http://users-service:3000/internal/users/by-username/${username}`);

	if (response.status === 404)
		return null;
	if (!response.ok)
		throw new Error('Users service failed.');
	return response.json() as Promise<UserData>;
}

async function createFriendRequest(senderId: number, receiverId: number): Promise<Response> {
	return fetch('http://friends-service:3000/internal/friends/requests', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderId, receiverId })
	});
}


export async function gatewayFriendRoutes(serv: FastifyInstance) {

serv.get('/health', async (request, reply) => {
	return reply.code(200).send({
		status: 'ok',
		service: 'api-gateway',
		message: 'Health check successful!'
	});
});


 	serv.post('/api/friends/requests', async (request, reply) => {
		try {
			const senderId = request.user.userID;
			const senderUsername = request.user.username;

			const { username: receiverUsername } = request.body as { username: string };

			if (!receiverUsername)
				return reply.code(400).send({ message: 'Missing receiver username in request body.' });

			if (senderUsername === receiverUsername)
				return reply.code(400).send({ message: 'You cannot send a friend request to yourself.' });

			const receiverUser = await findUserByUsername(receiverUsername);
			if (!receiverUser)
				return reply.code(404).send({ message: `User '${receiverUsername}' not found.` });

			const friendsServiceResponse = await createFriendRequest(senderId, receiverUser.userID);

			return reply
				.code(friendsServiceResponse.status)
				.send(await friendsServiceResponse.json());

		} catch (error) {
			serv.log.error(`[API Gateway] Error sending friend request: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });
		}
	});
}