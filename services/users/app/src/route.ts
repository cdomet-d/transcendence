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

interface UserRowConnection {
  lastConnexion: string;
}

interface UserStats {
	userID: number;
	longestMatch: number;
	shortestMatch: number;
	totalMatch: number;
	totalWins: number;
	winStreak: number;
	averageMatchDuration: number;
	highestScore: number;
}

export async function userRoutes(serv: FastifyInstance) {
	//USER PROFILE

	//get userID by username
	serv.get('/internal/users/by-username/:username', async (request, reply) => {
		try {
			const { username } = request.params as { username: string };
			const query = `SELECT userID, username FROM userProfile WHERE username = ?`;

			const user = await serv.dbUsers.get<UserRow>(query, [username]);

			if (!user) {
				return (reply.code(404).send({ 
					success: false,
					message: 'User not found'
				}));
			}
			//TODO: add success in this reply
			return (reply.code(200).send(user));

		} catch (error) {
			serv.log.error(error);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//get user's profile with userID
	serv.get('/internal/users/profile/:userId', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				SELECT * FROM userProfile WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserProfile>(query, [userID]);

			if (!userProfile) {
				return reply.code(404).send({
					success: false,
					message: 'User profile not found' });
			}
			//TODO: add success in this reply
			return reply.code(200).send(userProfile);

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//get user's activity with userID
	serv.get('/users/activity/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT activityStatus FROM userProfile WHERE userID = ?
			`;

			const activityStatus = await serv.dbUsers.get<UserRow>(query, [userID]);
			if (!activityStatus)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			//TODO: add success in this reply
			return (reply.code(200).send(activityStatus));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//get user's lastConnextion with userID
	serv.get('/users/lastConnection/:userID', async(request, reply) => {
		try {
			const userID = parseInt((request.params as { userID: string }).userID, 10);

			const query = `
				SELECT lastConnexion FROM userProfile WHERE userID = ?
			`;
			
			const lastConnection = await serv.dbUsers.get<UserRowConnection>(query, [userID]);
		
			if (!lastConnection)
				return reply.code(404).send({
					success: false,
					message: 'User not found'
				});
			//TODO: add success in this reply
			return reply.code(200).send(lastConnection);

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
});

	//update user's avatar with userID
	serv.post('/users/updateAvatar/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newAvatar } = request.params as { newAvatar: string };

			const query = `
				UPDATE userProfile SET avatar = ? WHERE userID = ?
			`;

			const params = [
				newAvatar,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found '
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Avatar updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//update user's bio with userID
	serv.post('/users/updateBio/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's profile color with userID
	serv.post('/users/updateProfilColor/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's activity with userID
	serv.post('/users/updateActivityStatus/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's last connextion with userID
	serv.post('/users/updateLastConnexion/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's username with userID
	serv.post('/users/updateUsername/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//USER STATS
	//get all user's stats with userID
	serv.get('/users/usersStats/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				SELECT * FROM userStats WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserStats>(query, [userID]);

			if (!userProfile) {
				return reply.code(404).send({ message: 'User profile not found' });
			}

			return reply.code(200).send(userProfile);
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's longuest match with userID
	serv.post('/users/updateLonguestMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's shortest match with userID
	serv.post('/users/updateShortestMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's total match with userID
	serv.post('/users/updateTotalMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's total wins with userID
	serv.post('/users/updateWins/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's win streak with userID
	serv.post('/users/updateWinStreak/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's average match duration with userID
	serv.post('/users/updateAverageMatchDuration/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's highest score with userID
	serv.post('/users/updateHighestScore/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});
}