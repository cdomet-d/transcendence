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
	[key: string]: number;
}

export async function userRoutes(serv: FastifyInstance) {
	//USER PROFILE

	//get userID by username
	serv.get('/internal/users/:username/userID', async (request, reply) => {
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

			return reply.code(200).send({
				success: true,
				message: "userID found!",
				user
			});

		} catch (error) {
			serv.log.error(error);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	serv.get('/internal/users/userID/profile', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!Array.isArray(userIDs) || userIDs.length === 0)
				return (reply.code(400).send({ message: 'userIDs must be a non-empty array.' }));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
			SELECT * FROM userProfile WHERE userID IN (${placeholders})
		`;

			const profiles = await serv.dbUsers.all<UserProfile[]>(query, userIDs);

			return reply.code(200).send({
				success: true,
				message: "Profiles found!",
				profiles
			});

		} catch (error) {
			serv.log.error(`Error fetching user profiles by IDs: ${error}`);
			return (reply.code(500).send({
				success: false,
				message: 'Internal server error'
			}));
		}
	});

	//get username by userID
	serv.get('/internal/users/:userID/username', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const query = `SELECT username FROM userProfile WHERE userID = ?`;

			const user = await serv.dbUsers.get<UserRow>(query, [userID]);
			if (!user) {
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			}

			return reply.code(200).send({
				success: true,
				message: "Username found!",
				user
			});

		} catch (error) {
			serv.log.error(error);
			return reply.code(500).send({
				success: false,
				message: 'Internal server error'
			});
		}
	});

	//get user's profile with userID
	serv.get('/internal/users/:userID/profile', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				SELECT * FROM userProfile WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserProfile>(query, [userID]);
			if (!userProfile) {
				return reply.code(404).send({
					success: false,
					message: 'User profile not found'
				});
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
	serv.get('/internal/users/:userID/activity-status', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

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
	serv.get('/internal/users/:userID/last-connection', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const newConnection = parseInt((request.params as { newConnection: string }).newConnection, 10);

			const query = `
				SELECT lastConnexion FROM userProfile WHERE userID = ?
			`;

			const params = [
				newConnection,
				userID
			];
			const lastConnection = await serv.dbUsers.get<UserRowConnection>(query, params);
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

	serv.post('/internal/users/:userID/profile', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { username } = request.params as { username: string };

			try {
				const [profileResponse, statsResponse] = await Promise.all([
					fetch(`https://users:2626/internal/users/profile/${userID}`),
					fetch(`https://users:2626/users/userStats/${userID}`)
				]);
				if (profileResponse.ok) {
					return reply.code(409).send({
						success: false,
						message: 'This user profile already exists.'
					});
				}

				if (statsResponse.ok) {
					return reply.code(409).send({
						success: false,
						message: 'User stats for this profile already exist.'
					});
				}

				if (profileResponse.status !== 404 || statsResponse.status !== 404) {
					serv.log.error(`Unexpected status from users service. Profile: ${profileResponse.status}, Stats: ${statsResponse.status}`);
					return reply.code(502).send({
						success: false,
						message: 'An unexpected error occurred while checking with the users service.'
					});
				}

			} catch (fetchError) {
				serv.log.error(`Could not connect to the users service: ${fetchError}`);
				return reply.code(503).send({
					success: false,
					message: 'The users service is currently unavailable.'
				});
			}

			const queryProfile = `
				INSERT INTO userProfile
				(userID, username, avatar, bio, profileColor, activityStatus, lastConnection)
				VALUES (?, ?, default, default, default, 1, ?)
			`
			const paramsProfile = [
				userID,
				username,
				new Date().toISOString()
			];

			const createProfile = await serv.dbUsers.run(queryProfile, paramsProfile);
			if (createProfile.changes === 0) {
				return reply.code(404).send({
					success: false,
					message: 'Profile could not be created.'
				});
			}

			const queryStats = `
			INSERT INTO userStats (userID, longestMatch, shorestMatch, totalMatch, totalWins,
			winStreak, averageMatchDuration, highestScore)
			VALUES (?, 0, 0, 0, 0, 0, 0, 0)
			`
			const createStats = await serv.dbUsers.run(queryStats, userID);
		} catch (error) {
			console.error('[Friend service] Error accepting friend request', error);
			return (reply.code(500).send({
				success: false,
				message: 'An internal error occured.'
			}));
		}
	});

	serv.patch('/internal/users/:userID/profile', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const statsToUpdate = request.body as { [key: string]: number };

			const validStatKeys = [
				'username',
				'avatar',
				'bio',
				'profileColor',
			];

			const keysToUpdate = Object.keys(statsToUpdate).filter(key => validStatKeys.includes(key));

			if (keysToUpdate.length === 0) {
				return (reply.code(400).send({
					success: false,
					message: 'No valid stat fields provided for update.'
				}));
			}

			const setClauses = keysToUpdate.map(key => `${key} = ?`).join(', ');
			const params = keysToUpdate.map(key => statsToUpdate[key]);
			params.push(userID);

			const query = `
				UPDATE userProfile SET ${setClauses} WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, params);
			if (result.changes === 0) {
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			}

			return (reply.code(200).send({
				success: true,
				message: 'User profile updated successfully!'
			}));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//update user's avatar with userID
	serv.patch('/internal/users/:userID/avatar', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const { value } = request.body as { value: string };
			
			if (typeof value !== 'string') {
				return reply.code(400).send({
					success: false,
					message: 'Validation error: newStatus must be a number.'
				});
			}

			const query = `
				UPDATE userProfile SET avatar = ? WHERE userID = ?
			`;

			const params = [
				value,
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
	serv.patch('/internal/users/:userID/bio', async (request, reply) => {
		try {
			const userID = request.user.userID;
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
	serv.patch('/internal/users/:userID/profil-color', async (request, reply) => {
		try {
			const userID = request.user.userID;
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
	serv.patch('/internal/users/:userID/activity-status', async (request, reply) => {
		try {
			const userID = request.user.userID;
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
	serv.patch('/internal/users/:userID/last-connection', async (request, reply) => {
		try {
			const userID = request.user.userID;
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

	//TODO : check if the route is formatted following good practice
	//update user's username with userID
	serv.patch('/internal/users/:userID/username', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { newUsername } = request.body as { newUsername: string };

			const query = `UPDATE userProfile SET username = ? WHERE userID = ?`;
			const params = [newUsername, userID];
			const result = await serv.dbUsers.run(query, params);

			if (result.changes === 0) {
				return reply.code(404).send({ success: false, message: 'User profile not found.' });
			}

			return reply.code(200).send({ success: true, message: 'Username in profile updated!' });
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return (reply.code(409).send({ success: false, message: 'This username is already taken.' }));
			}
			serv.log.error(`Error updating username in profile: ${error}`);
			return reply.code(500).send({ success: false, message: 'Internal server error' });
		}
	});

	//USER STATS
	//get all user's stats with userID
	serv.get('/internal/users/:userID/stats', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				SELECT * FROM userStats WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserStats>(query, [userID]);
			if (!userProfile)
				return (reply.code(404).send({ message: 'User profile not found' }));

			return (reply.code(200).send(userProfile));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update all stats of a user
	serv.patch('/internal/users/:userID/stats', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const actions = request.body as { action: string, field: string, value: number }[];

			const currentStats = await serv.dbUsers.get<UserStats>('SELECT * FROM userStats WHERE userID = ?', [userID]);
			if (!currentStats)
				return reply.code(404).send({ message: 'User not found.' });

			const updates: { [key: string]: number } = {};
			const validFields = ['totalMatch', 'totalWins', 'longestMatch', 'shortestMatch', 'highestScore'];

			for (const action of actions) {
				if (!validFields.includes(action.field))
					continue;

				switch (action.action) {
					case 'increment': {
						updates[action.field] = (currentStats[action.field] || 0) + action.value;
						break;
					}
					case 'setIfGreater': {
						if (action.value > (currentStats[action.field] || 0))
							updates[action.field] = action.value;
						break;
					}
					case 'setIfLess': {
						const currentValue = currentStats[action.field];
						if (currentValue === undefined || currentValue === 0 || action.value < currentValue)
							updates[action.field] = action.value;
						break;
					}
				}
			}

			if (Object.keys(updates).length === 0)
				return reply.code(200).send({ message: 'No stats were updated.' });

			const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
			const params = [...Object.values(updates), userID];
			const query = `UPDATE userStats SET ${setClauses} WHERE userID = ?`;

			const result = await serv.dbUsers.run(query, params);
			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			
			return reply.code(200).send({ message: 'User stats updated successfully.' });

		} catch (error) {
			serv.log.error(`Error updating user stats: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	// TODO: Should we check the value of the current longuest match here or before calling the function altogether ? 
	//update user's longuest match with userID
	serv.patch('/internal/users/:userID/stats/longest-match', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const { newLonguestMatch } = request.body as { newLonguestMatch: any };

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
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Longuest match updated !'
			}));

		} catch (error) {
			serv.log.error(`Error updating longest match: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's shortest match with userID
	serv.patch('/internal/users/:userID/stats/shortest-match', async (request, reply) => {
		try {
			const userID = request.user.userID;
			const { newShortestMatch } = request.body as { newShortestMatch: any };

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
					message: 'User not found or'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Shortest match updated !'
			}));

		} catch (error) {
			serv.log.error(`Error updating shorest match: ${error}`);
			return reply.code(500).send({ message: 'Internal server error' });
		}
	});

	//update user's total match with userID
	serv.patch('/internal/users/:userID/stats/total-match', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				UPDATE userStats SET totalMatch = totalMatch + 1 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, [userID]);
			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Total matches updated !'
			}));

		} catch (error) {
			serv.log.error(`Error updating total match: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//update user's total wins with userID
	serv.patch('/internal/users/:userID/stats/total-wins', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				UPDATE userStats SET totalWins = totalWins + 1 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, [userID]);
			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Total wins updated !'
			}));

		} catch (error) {
			serv.log.error(`Error updating total wins: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//add one to user's win streak with userID
	serv.post('/internal/users/:userID/stats/win-streak/increment', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				UPDATE userStats SET winStreak = winStreak + 1 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, userID);
			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Win streak incremented!'
			}));

		} catch (error) {
			serv.log.error(`Error incrementing win streak: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//set user's win streak to zero with userID
	serv.patch('/internal/users/:userID/stats/win-streak/reset', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				UPDATE userStats SET winStreak = 0 WHERE userID = ?
			`;

			const result = await serv.dbUsers.run(query, userID);
			if (!result.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Win streak reset!'
			}));

		} catch (error) {
			serv.log.error(`Error resetting win streak: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//update user's average match duration with userID
	serv.patch('/internal/users/:userID/stats/average-match-duration', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newDuration } = request.body as { newDuration: any };

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
					message: 'User not found'
				}));

			return (reply.code(200).send({
				success: true,
				message: 'Average game duration updated !'
			}));

		} catch (error) {
			serv.log.error(`Error updating average match duration: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//update user's highest score with userID
	serv.patch('/internal/users/:userID/stats/highest-score', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const { newHighScore } = request.body as { newHighScore: any };

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
			serv.log.error(`Error updating highest score: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});
}