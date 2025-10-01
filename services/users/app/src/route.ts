import type { FastifyInstance } from 'fastify';

interface UserProfile {
    userID: number;
    username: string;
    avatar: string;
    biography: string;
    profileColor: string;
}

interface UserRow {
  userID: number;
  username: string;
}

export async function userRoutes(serv: FastifyInstance) {
	//get id by username
	//TODO : needed anymore ?
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

	serv.get('/internal/users/profile/:userId', async (request, reply) => {
        try {
            const { userId } = request.params as { userId: number };

            // Query your userProfile table for all the necessary info
            const query = `
                SELECT * FROM userProfile WHERE userID = ?
            `;

            const userProfile = await serv.dbUsers.get<UserProfile>(query, [userId]);

            if (!userProfile) {
                return reply.code(404).send({ message: 'User profile not found' });
            }

            // On success, return the full profile object
            return reply.code(200).send(userProfile);

        } catch (error) {
            serv.log.error(`Error fetching user profile: ${error}`);
            return reply.code(500).send({ message: 'Internal server error' });
        }
    });
}