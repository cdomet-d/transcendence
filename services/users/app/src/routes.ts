import type { FastifyInstance } from 'fastify';
import { updateUserStats } from './dashboard.service.js'
import type { GameInput, userStats } from '././dashboard.service.js';
import { cleanInput } from './sanitizer.js';
import {
	anonymizeUserSchema, getUserByNameSchema, getLeaderboardSchema, getProfilesByIdsSchema, getUserByUsernameBodySchema, searchUsersSchema, updateStatsSchema, getUserIDByUsernameSchema,
	getUserProfileSchema, getUserStatsSchema, getUsernamesByIdsSchema, createProfileSchema, deleteProfileSchema, updateProfileSchema
} from './schemas.js';
import { profile } from 'console';

export interface userData {
	avatar: string | null | undefined,
	biography: string,
	userID: string,
	lang: string,
	profileColor: string,
	status: boolean,
	username: string,
	winStreak: string,
	since: string,
	totalWins: string;
	totalLosses: string
}

interface JwtPayload {
	userID: string;
	username: string;
	iat: number;
	exp: number;
}

export async function userRoutes(serv: FastifyInstance) {
	//GET /<userID>
	serv.get('/:userID', { schema: getUserProfileSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const safeUserID = cleanInput(userID);

			const query = `
			SELECT
				p.*,
				s.winStreak,
				s.totalLosses,
				s.totalWins
			FROM userProfile p
			LEFT JOIN userStats s ON p.userID = s.userID
			WHERE p.userID = ?
		`;

			const userProfile = await serv.dbUsers.get<userData>(query, [safeUserID]);
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

	serv.get('/leaderboard', { schema: getLeaderboardSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const query = `
				SELECT
					p.avatar,
					p.biography,
					p.userID,
					p.lang,
					p.profileColor,
					p.status,
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

	serv.get('/search', { schema: searchUsersSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}
			const query = request.query as { name?: string };


			if (!query.name || query.name.length === 0)
				return reply.code(200).send({ success: true, profiles: [] });

			const safename = cleanInput(query.name);

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

			const searchParam = `${safename}%`;
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
	serv.post('/profiles', { schema: getProfilesByIdsSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

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
	serv.get('/userID/:username', { schema: getUserByNameSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const query = request.params as { username: string };

			if (query.username) {
				const safeUsername = cleanInput(query.username);
				const sql = `SELECT userID, username FROM userProfile WHERE username = ?`;
				const response = await serv.dbUsers.get(sql, [safeUsername]);

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

	serv.post('/username', { schema: getUserByUsernameBodySchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
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

			const { username } = request.body as { username: string };

			if (username) {
				const safeUsername = cleanInput(username);
				const sql = `SELECT userID, username FROM userProfile WHERE username = ?`;
				const response = await serv.dbUsers.get(sql, [safeUsername]);

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
				message: 'A query parameter (e.g., ?userID=...) is required.'
			}));
		} catch (error) {
			serv.log.error(`Error fetching user profile: ${error}`);
			throw (error);
		}
	});

	serv.post('/usernames', { schema: getUsernamesByIdsSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userIDs } = request.body as { userIDs: string[] };

			if (!userIDs || userIDs.length === 0)
				return (reply.code(200).send({ success: true, usersNames: [] }));

			const placeholders = userIDs.map(() => '?').join(',');

			const query = `
				SELECT userID, username 
				FROM userProfile p 
				WHERE p.userID IN (${placeholders})
			`;

			const usersNames = await serv.dbUsers.all<{ userID: number, username: string }[]>(query, userIDs);
			return (reply.code(200).send({ success: true, usersNames }));

		} catch (error) {
			serv.log.error(error);
			throw (error);
		}
	});

	//create profile and stats
	//Called by auth so no need for JWT verif
	serv.post('/:userID', { schema: createProfileSchema }, async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			const { username } = request.body as { username: string };
			const safeuserID = cleanInput(userID);
			const safeUsername = cleanInput(username);

			const queryProfile = `
				INSERT INTO userProfile
				(userID, username, status, profileColor, userRole, since, lang, lastConnexion)
				VALUES (?, ?, 0, "bg-000080", 1, ?, "en", ?)
			`;
			const paramsProfile = [
				safeuserID,
				safeUsername,
				new Date().toISOString(),
				new Date().toISOString(),
			];

			const createProfile = await serv.dbUsers.run(queryProfile, paramsProfile);
			if (createProfile.changes === 0)
				throw new Error('Database Error: Profile INSERT failed (0 changes).');

			const queryStats = `
				INSERT INTO userStats (userID, longestMatch, shortestMatch, totalMatch, totalWins, totalLosses,
				winStreak, averageMatchDuration, longuestPass)
				VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0)
			`;

			const createStats = await serv.dbUsers.run(queryStats, [safeuserID]);
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

	//TODO fix schema
	//update user profile
	serv.patch('/:userID', /* { schema: updateProfileSchema }, */ async (request, reply) => {
		try {
			const token = request.cookies.token;
			let user;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const body = request.body as { [key: string]: any };

			if (user?.userID !== userID) {
				serv.log.warn(`User ${user?.userID} attempted to patch User ${userID}`);
				return reply.code(403).send({ message: 'Forbidden: You can only update your own profile.' });
			}

			const safeUserID = cleanInput(userID);

			const validStatKeys = [
				'username',
				'avatar',
				'biography',
				'profileColor',
				'lang',
				'status',
				'lastConnexion'
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
			params.push(safeUserID);

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
			if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')
				return (reply.code(409).send({ success: false, message: 'This username is already taken.' }));
			serv.log.error(`Error fetching user profile: ${error}`);
			throw error;
		}
	});

	//delete profile and stats
	serv.delete('/:userID', { schema: deleteProfileSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const safeUserID = cleanInput(userID);

			const query = `
				DELETE FROM userProfile WHERE userID = ?;
				DELETE FROM userStats WHERE userID = ?;
			`;

			const response = await serv.dbUsers.run(query, [safeUserID, safeUserID]);
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
	serv.get('/stats/:userID', { schema: getUserStatsSchema }, async (request, reply) => {
		try {

			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const safeUserID = cleanInput(userID);

			const query = `
				SELECT * FROM userStats WHERE userID = ?
			`;

			const userStats = await serv.dbUsers.get<userStats>(query, [safeUserID]);
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
	//Called in game-manager so no need for JWT verif
	serv.patch('/stats', { schema: updateStatsSchema }, async (request, reply) => {
		try {
			const body = request.body as GameInput;

			if (!body.player1 || !body.player2)
				return reply.code(400).send({ message: 'Missing player IDs' });

			const p1IsWinner = body.player1Score > body.player2Score;
			const p2IsWinner = body.player2Score > body.player1Score;

			await Promise.all([
				updateUserStats(serv, body.player1, p1IsWinner, body),
				updateUserStats(serv, body.player2, p2IsWinner, body)
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
			throw error;
		}
	});

	serv.patch('/anonymize', {schema: anonymizeUserSchema}, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const userID = request.user.userID;
			const safeUserID = cleanInput(userID);

			const newUsername = `DeletedUser_${crypto.randomUUID().slice(0, 8)}`;
			const placeholderAvatar = '/public/default_avatar.png';

			const query = `UPDATE userProfile SET username = ?, avatar = ?, biography = NULL WHERE userID = ?`;

			const result = await serv.dbUsers.run(query, [newUsername, placeholderAvatar, safeUserID]);

			if (result.changes === 0) {
				return reply.code(404).send({ message: 'User not found' });
			}

			return reply.code(200).send({ success: true, message: 'User anonymized' });

		} catch (error) {
			serv.log.error(`[USERS] Error processing anonymization: ${error}`);
			if (error instanceof Error && error.message.includes('Stats not found')) {
				return reply.code(404).send({ message: error.message });
			}
			throw error;
		}
	});
}
