import type { FastifyInstance } from 'fastify';
import { request } from 'http';

interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biographygraphy: string;
	profileColor: string;
}

interface UserRow {
	userID: number;
	username: string;
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

	//GET /internal/users/<userID>
	serv.get('/internal/users/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT * FROM userProfile WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserProfile>(query, [userID]);
			if (!userProfile) {
				return (reply.code(404).send({
					success: false,
					message: 'User profile not found'
				}));
			}

			return (reply.code(200).send({
				success: true,
				profile: userProfile
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	//GET /internal/users?username=<username>
	serv.get('/internal/users', async (request, reply) => {
		try {
			const query = request.query as { username?: string };

			if (query.username) {
				const sql = `SELECT userID, username FROM userProfile WHERE username = ?`;
				const user = await serv.dbUsers.get<UserRow>(sql, [query.username]);

				if (!user) {
					return (reply.code(404).send({
						success: false,
						message: 'User not found'
					}));
				}
				return (reply.code(200).send({
					success: true,
					message: "user found!",
					user
				}));
			}

			return (reply.code(400).send({
				success: false,
				message: 'A query parameter (e.g., ?username=...) is required.'
			}));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	//get user profile
	serv.post('/internal/users/profile', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!Array.isArray(userIDs) || userIDs.length === 0)
				return (reply.code(400).send({ success: false, message: 'userIDs must be a non-empty array.' }));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
			SELECT * FROM userProfile WHERE userID IN (${placeholders})
		`;

			const profiles = await serv.dbUsers.all<UserProfile[]>(query, userIDs);

			return (reply.code(200).send({
				success: true,
				message: "Profiles found!",
				profiles
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profiles by IDs: ${error}`);
			throw (error);
		}
	});

	//create profile and stats
	serv.post('/internal/users/:userID/profile', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { username } = request.body as { username: string };

			const queryProfile = `
				INSERT INTO userProfile
				(userID, username, avatar, biography, profileColor, activityStatus, lastConnection)
				VALUES (?, ?, default, default, default, 1, ?)
			`;
			const paramsProfile = [
				userID,
				username,
				new Date().toISOString()
			];

			const createProfile = await serv.dbUsers.run(queryProfile, paramsProfile);
			if (createProfile.changes === 0) {
				return (reply.code(500).send({
					success: false,
					message: 'Profile could not be created.'
				}));
			}

			const queryStats = `
				INSERT INTO userStats (userID, longestMatch, shorestMatch, totalMatch, totalWins,
				winStreak, averageMatchDuration, highestScore)
				VALUES (?, 0, 0, 0, 0, 0, 0, 0)
			`;

			const createStats = await serv.dbUsers.run(queryStats, [userID]);
			if (createStats.changes === 0) {
				return (reply.code(500).send({
					success: false,
					message: 'Stats could not be created.'
				}));
			}
			return (reply.code(201).send({ success: true, message: 'Profile created successfully!' }));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return (reply.code(409).send({
					success: false,
					message: 'A profile for this user already exists.'
				}));
			}
			serv.log.error(`Error creating user profile: ${error}`);
			throw (error);
		}
	});

	//update user profile
	serv.patch('/internal/users/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const body = request.body as { [key: string]: any };

			const validStatKeys = [
				'username',
				'avatar',
				'biography',
				'profileColor',
			];

			const keysToUpdate = Object.keys(body).filter(key => validStatKeys.includes(key));

			if (keysToUpdate.length === 0) {
				return (reply.code(400).send({
					success: false,
					message: 'No valid stat fields provided for update.'
				}));
			}

			const setClauses = keysToUpdate.map(key => `${key} = ?`).join(', ');
			const params = keysToUpdate.map(key => body[key]);
			params.push(userID);

			const query = `
				UPDATE userProfile SET ${setClauses} WHERE userID = ?
			`;

			const response = await serv.dbUsers.run(query, params);
			if (response.changes === 0) {
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
			if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')
				return (reply.code(409).send({ success: false, message: 'This username is already taken.' }));
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	//delete profile and stats
	serv.delete('/internal/users/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				DELETE FROM userProfile WHERE userID = ?;
				DELETE FROM userStats WHERE userID = ?;
			`

			const response = await serv.dbUsers.run(query, [userID, userID]);
			if (!response.changes)
				return (reply.code(404).send({ success: false, message: 'User profile/stats not found.' }));
			return (reply.code(204).send({ success: true, message: 'User profile and stats deleted !' }))
		} catch (error) {
			serv.log.error(`Error deleting user profile: ${error}`);
			throw (error);
		}
	})

	//USER STATS
	//get all user's stats with userID
	serv.get('/internal/users/:userID/stats', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT * FROM userStats WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<UserStats>(query, [userID]);
			if (!userProfile)
				return (reply.code(404).send({ success: false, message: 'User profile not found' }));

			return (reply.code(200).send({ success: true, userProfile }));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	//update all stats of a user
	serv.patch('/internal/users/:userID/stats', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const actions = request.body as { action: string, field: string, value: number }[];

			const currentStats = await serv.dbUsers.get<UserStats>('SELECT * FROM userStats WHERE userID = ?', [userID]);
			if (!currentStats)
				return reply.code(404).send({ success: false, message: 'User not found.' });

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
				return reply.code(200).send({ success: true, message: 'No stats were updated.' });

			const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
			const params = [...Object.values(updates), userID];
			const query = `UPDATE userStats SET ${setClauses} WHERE userID = ?`;

			const response = await serv.dbUsers.run(query, params);
			if (!response.changes)
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));

			return reply.code(200).send({ success: true, message: 'User stats updated successfully.' });

		} catch (error) {
			serv.log.error(`Error updating user stats: ${error}`);
			throw (error);
		}
	});

	serv.get('internal/users/:userID/userData', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT
					p.avatar,
					p.biography,
					p.profileColor,
					s.winStreak
				FROM
					userProfile p
				JOIN
					userStats s ON p.userID = s.userID
				WHERE
					p.userID = ?
			`;

			const userData = await serv.dbUsers.get(query, [userID]);
			if (!userData) {
				return (reply.code(404).send({
					success: false,
					message: 'User data not found.'
				}));
			}

			return (reply.code(200).send({ success: true, userData }));
		} catch (error) {
			serv.log.error(`[USERS] Error fetching user data win streak: ${error}`);
			throw (error);
		}
	});

	serv.post('/internal/users/userDataBatch', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send([]));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT
					p.userID,
					p.avatar,
					p.biography,
					p.profileColor,
					s.winStreak
				FROM
					userProfile p
				JOIN
					userStats s ON p.userID = s.userID
				WHERE
					p.userID IN (${placeholders})
			`;

			const usersData = await serv.dbUsers.all(query, userIDs);
			return (reply.code(200).send({ success: true, usersData }));

		} catch (error) {
			serv.log.error(`[USERS] Error fetching user data batch: ${error}`);
			throw (error);
		}
	});

	//TODO: code this : const response = await fetch(`https://user:2626/internal/users/activity/${userID}`);

	/*
	//get username by userID
	serv.get('/internal/users/:userID/username', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };
			const query = `SELECT username FROM userProfile WHERE userID = ?`;

			const user = await serv.dbUsers.get<UserRow>(query, [userID]);
			if (!user) {
				return (reply.code(404).send({
					success: false,
					message: 'User not found'
				}));
			}

			return (reply.code(200).send({
				success: true,
				message: "Username found!",
				user
			}));

		} catch (error) {
			serv.log.error(error);
			return (reply.code(500).send({
				success: false,
				message: 'Internal server error'
			}));
		}
	});
	
	serv.post('/api/games/responses', async (request, reply) => {
		try {
			const { winnerID, loserID, duration, winnerScore } = request.body as any;

			const winnerActions = [
				{ action: 'increment', field: 'totalMatch', value: 1 },
				{ action: 'increment', field: 'totalWins', value: 1 },
				{ action: 'setIfGreater', field: 'longestMatch', value: duration },
				{ action: 'setIfLess', field: 'shortestMatch', value: duration },
				{ action: 'setIfGreater', field: 'highestScore', value: winnerScore }
			];

			const loserActions = [
				{ action: 'increment', field: 'totalMatch', value: 1 },
				{ action: 'setIfGreater', field: 'longestMatch', value: duration },
				{ action: 'setIfLess', field: 'shortestMatch', value: duration }
			];

			await Promise.all([
				updateUserStats(winnerID, winnerActions),
				incrementWinStreak(winnerID),

				updateUserStats(loserID, loserActions),
				resetWinStreak(loserID)
			]);

			return reply.code(200).send({ message: 'Game responses processed.' });
		} catch (error) {
			serv.log.error(`[BFF] Error processing game responses: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});*/
}