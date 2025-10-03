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
	serv.get('/internal/users/profile/:userID', async (request, reply) => {
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

			return reply.code(200).send({
				success: true,
				profile: userProfile
			});

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

			return (reply.code(200).send({
				success: true,
				activityStatus: activityStatus
			}));

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

			return reply.code(200).send({
				success: true,
				lastConnection: lastConnection
			});

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

			if (typeof newAvatar !== 'string') {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newStatus must be a number.'
				});
			}


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
					message: 'User not found or request parameters are wrong'
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
			const { newBio } = request.params as { newBio: string };

			const query = `
				UPDATE userProfile SET bio = ? WHERE userID = ?
			`;

			const params = [
				newBio,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Bio updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//update user's profile color with userID
	serv.post('/users/updateProfileColor/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newProfileColor } = request.params as { newProfileColor: string };

			if (typeof newProfileColor !== 'string') {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newStatus must be a number.'
				});
			}

			const query = `
				UPDATE userProfile SET profileColor = ? WHERE userID = ?
			`;

			const params = [
				newProfileColor,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Profile Color updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's activity with userID
	serv.post('/users/updateActivityStatus/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newStatus } = request.body as { newStatus: any };

			const statusAsNumber = parseInt(newStatus, 10);

			const validStatuses = [0, 1, 2];
			if (isNaN(statusAsNumber) || !validStatuses.includes(statusAsNumber)) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newStatus must be 0, 1, or 2.'
				});
			}

			const query = `
				UPDATE userProfile SET activityStatus = ? WHERE userID = ?
			`;

			const params = [
				newStatus,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Activity status updated !'
			}));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's last connextion with userID
	serv.post('/users/updateLastConnection/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newConnection } = request.body as { newConnection: any };

			const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
			if (typeof newConnection !== 'string' || !dateTimeRegex.test(newConnection)) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newConnection must be in YYYY-MM-DD HH:MM:SS format.'
				});
			}			

			const date = new Date(newConnection);
			if (isNaN(date.getTime())) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: The provided date is not a valid calendar date.'
				});
			}

			const query = `
				UPDATE userProfile SET lastConnection = ? WHERE userID = ?
			`;

			const params = [
				date.toISOString(),
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Last connection updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's username with userID
	serv.post('/users/updateUsername/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newUsername } = request.body as { newUsername: string };

			const query = `
				UPDATE userProfile SET username = ? WHERE userID = ?
			`;

			const params = [
				newUsername,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Username updated !'
			}));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error) {
				return reply.code(409).send({
					success: false,
					message: 'This username is already taken.'
				});
			}
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//USER STATS
	//get all user's stats with userID
	serv.get('/users/userStats/:userID', async(request, reply) => {
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

	// TODO: Should we check the value of the current longuest match here or before calling the function altogether ? 
	//update user's longuest match with userID
	serv.post('/users/updateLonguestMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newLonguestMatch } = request.body as { newLonguestMatch: any };

			if (typeof newLonguestMatch !== 'number' && isNaN(parseInt(newLonguestMatch, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newStatus must be a valid number.'
				});
			}

			const query = `
				UPDATE userStats SET longestMatch = ? WHERE userID = ?
			`;

			const params = [
				newLonguestMatch,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Longuest match updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's shortest match with userID
	serv.post('/users/updateShortestMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newShortestMatch } = request.body as { newShortestMatch: any };

			if (typeof newShortestMatch !== 'number' && isNaN(parseInt(newShortestMatch, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: shorestMatch must be a valid number.'
				});
			}
			
			const query = `
				UPDATE userStats SET shorestMatch = ? WHERE userID = ?
			`;

			const params = [
				newShortestMatch,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Shortest match updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's total match with userID
	serv.post('/users/updateTotalMatch/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newWins } = request.body as { newTotalMatch: any };

			if (typeof newTotalMatch !== 'number' && isNaN(parseInt(newTotalMatch, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: totalMatch must be a valid number.'
				});
			}
			
			const query = `
				UPDATE userStats SET totalMatch = ? WHERE userID = ?
			`;

			const params = [
				newTotalMatch,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Total matches updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's total wins with userID
	serv.post('/users/updateWins/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newWins } = request.body as { newWins: any };

			if (typeof newWins !== 'number' && isNaN(parseInt(newWins, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: totalWins must be a valid number.'
				});
			}
			
			const query = `
				UPDATE userStats SET totalWins = ? WHERE userID = ?
			`;

			const params = [
				newWins,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Total wins updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//add one to user's win streak with userID
	serv.post('/users/endWinStreak/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				UPDATE userStats SET winStreak = winStreak + 1 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, userID);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Total wins updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//set user's win streak to zero with userID
	serv.post('/users/addWinStreak/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			
			const query = `
				UPDATE userStats SET winStreak = 0 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, userID);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Total wins updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's average match duration with userID
	//TODO: do I code average calculation logic here, or just worry about updating the value in the DB ?
	serv.post('/users/updateAverageMatchDuration/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newDuration } = request.body as { newDuration: any };

			if (typeof newDuration !== 'number' && isNaN(parseInt(newDuration, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: averageMatchDuration must be a valid number.'
				});
			}
			
			const query = `
				UPDATE userStats SET averageMatchDuration = ? WHERE userID = ?
			`;

			const params = [
				newDuration,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Average game duration updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's highest score with userID
	serv.post('/users/updateHighestScore/:userID', async(request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newHighScore } = request.body as { newHighScore: any };

			if (typeof newHighScore !== 'number' && isNaN(parseInt(newHighScore, 10))) {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: highestScore must be a valid number.'
				});
			}
			
			const query = `
				UPDATE userStats SET highestScore = ? WHERE userID = ?
			`;

			const params = [
				newHighScore,
				userID
			];

			const result = await serv.dbUsers.run(query, params);

			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found or request parameters are wrong'
				}));
			
			return (reply.code(200).send({
				success: true,
				message: 'Highest score updated !'
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});
}