import type { FastifyInstance } from 'fastify';
import { updateUserStats } from './dashboard.service.js'
import type { GameInput, userStats } from '././dashboard.service.js';


export interface userData {
	avatar: string | null | undefined,
	biography: string,
	userID: string,
	lang: string,
	profileColor: string,
	status: boolean,
	username: string,
	winstreak: string,
	since: string
}

interface JwtPayload {
	userID: number;
	username: string;
	iat: number;
	exp: number;
}

export async function userRoutes(serv: FastifyInstance) {
	//USER PROFILE/${userID}/profile

	//GET /<userID>
	serv.get('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT * FROM userProfile WHERE userID = ?
			`;

			const userProfile = await serv.dbUsers.get<userData>(query, [userID]);
			if (!userProfile) {
				return (reply.code(404).send({
					success: false,
					message: 'User profile not found'
				}));
			}

			return (reply.code(200).send({
				success: true,
				userData: userProfile
			}));

		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	serv.get('/leaderboard', async (request, reply) => {
		try {
			const query = `
				SELECT
					p.avatar,
					p.biography,
					p.userID,
					p.lang,
					p.profileColor,
					p.activityStatus,
					p.lastConnection,
					p.userRole,
					p.username,
					s.winStreak,
					p.since
				FROM 
					userProfile p
				JOIN 
					userStats s ON p.userID = s.userID
				ORDER BY 
					s.winStreak DESC
				LIMIT 50;
			`;

			const leaderboard = await serv.dbUsers.all<userData[]>(query);

			return reply.code(200).send({
				success: true,
				profiles: leaderboard
			});

		} catch (error) {
			serv.log.error(`[USERS] Error fetching leaderboard: ${error}`);
			throw (error);
		}
	});

	serv.get('/search', async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}
			const query = request.query as { name?: string };

			if (!query.name || query.name.length === 0)
				return reply.code(200).send([]);

			//ASC is the way sqlite3 sorts result 
			const sql = `
				SELECT 
					p.*,
					s.winStreak as winstreak
				FROM 
					userProfile p
				LEFT JOIN 
					userStats s ON p.userID = s.userID
				WHERE 
					p.username LIKE ? 
				ORDER BY 
					length(p.username) ASC, p.username ASC 
				LIMIT 5
			`;

			const searchParam = `${query.name}%`;
			const profiles = await serv.dbUsers.all<userData[]>(sql, [searchParam]);

			return reply.code(200).send({
				success: true,
				profiles
			});
		} catch (error) {
			serv.log.error(`Error searching users: ${error}`);
			throw (error);
		}
	});

	//fetch users profiles
	serv.post('/profiles', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!Array.isArray(userIDs) || userIDs.length === 0)
				return reply
					.code(400)
					.send({ success: false, message: 'userIDs must be a non-empty array.' });

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
			SELECT * FROM userProfile WHERE userID IN (${placeholders})
		`;

			const profiles = await serv.dbUsers.all<userData[]>(query, userIDs);

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

	//GET ?username=<username>
	serv.get('/userID/:username', async (request, reply) => {
		try {
			const query = request.params as { username: string };

			if (query.username) {
				const sql = `SELECT userID, username FROM userProfile WHERE username = ?`;
				const response = await serv.dbUsers.get(sql, [query.username]);

				if (!response) {
					return (reply.code(404).send({
						success: false,
						message: 'User not found'
					}));
				}

				return (reply.code(200).send({
					success: true,
					message: "user found!",
					response
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

	serv.post('/usernames', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send({ success: true, usersNames: [] }));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT userID, username 
				FROM userProfile p 
				WHERE p.userID IN (${placeholders})
			`;

			const usersNames = await serv.dbUsers.all<{ userID: number, username: string }[]>(query, userIDs);

			serv.log.error(`${usersNames}`);

			return (reply.code(200).send({ success: true, usersNames }));

		} catch (error) {
			serv.log.error(error);
			return (reply.code(500).send({
				success: false,
				message: 'Internal server error'
			}));
		}
	});

	//create profile and stats
	serv.post('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { username } = request.body as { username: string };

			const queryProfile = `
				INSERT INTO userProfile
				(userID, username, activityStatus, lastConnection, profileColor, userRole, since, lang)
				VALUES (?, ?, 1, ?, "bg-BE5103", 1, ?, "en")
			`;
			const paramsProfile = [
				userID,
				username,
				new Date().toISOString(),
				new Date().toISOString(),
			];

			const createProfile = await serv.dbUsers.run(queryProfile, paramsProfile);
			if (createProfile.changes === 0)
				throw new Error('Database Error: Profile INSERT failed (0 changes).');

			const queryStats = `
				INSERT INTO userStats (userID, longestMatch, shortestMatch, totalMatch, totalWins,
				winStreak, averageMatchDuration, longuestPass)
				VALUES (?, 0, 0, 0, 0, 0, 0, 0)
			`;

			const createStats = await serv.dbUsers.run(queryStats, [userID]);
			if (createStats.changes === 0)
				throw new Error('Database Error: Stats INSERT failed (0 changes).');

			return reply
				.code(201)
				.send({ success: true, message: 'Profile created successfully!' });
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return (reply.code(409).send({
					success: false,
					message: 'A profile for this user already exists.',
				}));
			}
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT') {
				return (reply.code(409).send({
					success: false,
					message: 'UserID already taken',
				}));
			}
			serv.log.error(`Error creating user profile: ${error}`);
			throw error;
		}
	});

	//update user profile
	serv.patch('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const body = request.body as { [key: string]: any };

			const validStatKeys = [
				'username',
				'avatar',
				'biography',
				'profileColor',
				'lastConnection',
				'activityStatus',
				'lang',
			];

			const keysToUpdate = Object.keys(body).filter((key) => validStatKeys.includes(key));

			if (keysToUpdate.length === 0) {
				return reply.code(400).send({
					success: false,
					message: 'No valid stat fields provided for update.',
				});
			}

			const setClauses = keysToUpdate.map((key) => `${key} = ?`).join(', ');
			const params = keysToUpdate.map((key) => body[key]);
			params.push(userID);

			const query = `
				UPDATE userProfile SET ${setClauses} WHERE userID = ?
			`;

			const response = await serv.dbUsers.run(query, params);
			if (response.changes === 0) {
				return reply.code(404).send({
					success: false,
					message: 'User not found',
				});
			}

			return reply.code(200).send({
				success: true,
				message: 'User profile updated successfully!',
			});
		} catch (error) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				(error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
			)
				return reply
					.code(409)
					.send({ success: false, message: 'This username is already taken.' });
			serv.log.error(`Error fetching user profile: ${error}`);
			throw error;
		}
	});

	//delete profile and stats
	serv.delete('/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: number };

			const query = `
				DELETE FROM userProfile WHERE userID = ?;
				DELETE FROM userStats WHERE userID = ?;
			`;

			const response = await serv.dbUsers.run(query, [userID, userID]);
			if (!response.changes)
				return reply
					.code(404)
					.send({ success: false, message: 'User profile/stats not found.' });
			return reply
				.code(204)
				.send({ success: true, message: 'User profile and stats deleted !' });
		} catch (error) {
			serv.log.error(`Error deleting user profile: ${error}`);
			throw error;
		}
	});

	//USER STATS
	//get all user's stats with userID
	serv.get('/stats/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT * FROM userStats WHERE userID = ?
			`;

			const userStats = await serv.dbUsers.get<userStats>(query, [userID]);
			if (!userStats)
				return reply.code(404).send({ success: false, message: 'User profile not found' });


			return reply.code(200).send({
				success: true,
				stats: userStats
			});
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw error;
		}
	});

	//update all stats of a user
	serv.patch('/stats/:userID', async (request, reply) => {
		try {
			const body = request.body as GameInput;

			if (!body.playerID1 || !body.playerID2)
				return reply.code(400).send({ message: 'Missing player IDs' });

			const p1IsWinner = body.playerScore1 > body.playerScore2;
			const p2IsWinner = body.playerScore2 > body.playerScore1;

			await Promise.all([
				updateUserStats(serv, body.playerID1, p1IsWinner, body),
				updateUserStats(serv, body.playerID2, p2IsWinner, body)
			]);

			return reply.code(200).send({
				success: true,
				message: 'Stats updated for both players.'
			});

		} catch (error) {
			serv.log.error(`[USERS] Error processing match stats: ${error}`);
			if (error instanceof Error && error.message.includes('Stats not found')) {
				return reply.code(404).send({ message: error.message });
			}
			return reply.code(500).send({ message: 'Internal Server Error' });
		}
	});

	/* 	serv.get('/:userID/userData', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };

			const query = `
				SELECT
					p.avatar,
					p.biography,
					p.profileColor,
					p.activityStatus,
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

	serv.post('/userDataBatch', async (request, reply) => {
		try {
			const { userIDs } = request.body as { userIDs: number[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send([]));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT
					p.userID,
					p.username,
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
	}); */

	// ROUTE NOT USED BUT KEEPING JUST IN CASE MIGHT BE DELETED LATER
	/*
	
	serv.post('/api/games/responses', async (request, reply) => {
		try {
			const { winnerID, loserID, duration, winnerScore } = request.body as any;

			const winnerActions = [
				{ action: 'increment', field: 'totalMatch', value: 1 },
				{ action: 'increment', field: 'totalWins', value: 1 },
				{ action: 'setIfGreater', field: 'longestMatch', value: duration },
				{ action: 'setIfLess', field: 'shortestMatch', value: duration },
				{ action: 'setIfGreater', field: 'longuestPass', value: winnerScore }
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
