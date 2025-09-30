import type { FastifyInstance } from 'fastify';

interface UserRow {
  userID: number;
  username: string;
}

export async function userRoutes(serv: FastifyInstance) {
	serv.get('/internal/users/by-username/:username', async (request, reply) => {
		try {
			const { username } = request.params as { username: string };
			const query = `SELECT userID, username FROM userProfile WHERE username = ?`;

			const user = await serv.dbUsers.get<UserRow>(query, [username]);

			if (!user) {
				return (reply.code(404).send({ message: 'User not found' }));
			}
			return (reply.code(200).send(user));

		} catch (error) {
			serv.log.error(error);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});
}