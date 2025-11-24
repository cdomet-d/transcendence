import type { FastifyInstance } from 'fastify';
import { request } from 'http';

interface UserProfile {
    userID: number;
    username: string;
    avatar: string;
    biography: string;
    profileColor: string;
    winstreak: number;
    lang: string;
    status: boolean;
    since: string;
}

interface UserStats {
    userID: number;
    longestMatch: number;
    shortestMatch: number;
    totalMatch: number;
    totalWins: number;
    winStreak: number;
    averageMatchDuration: number;
    longuestPass: number;
    [key: string]: number;
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

            const userProfile = await serv.dbUsers.get<UserProfile>(query, [userID]);
            if (!userProfile) {
                return reply.code(404).send({
                    success: false,
                    message: 'User profile not found',
                });
            }

            return reply.code(200).send({
                success: true,
                profile: userProfile,
            });
        } catch (error) {
            serv.log.error(`Error fetching user profile: ${error}`);
            throw error;
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

            const profiles = await serv.dbUsers.all<UserProfile[]>(query, userIDs);

            return reply.code(200).send({
                success: true,
                message: 'Profiles found!',
                profiles,
            });
        } catch (error) {
            serv.log.error(`Error fetching user profiles by IDs: ${error}`);
            throw error;
        }
    });

    //TODO: Endpoint for search bar
    serv.get('/search?name=', async (request, reply) => {
        // TODO: get request from URL
        // const { name } = request.query;
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
				INSERT INTO userStats (userID, longestMatch, shorestMatch, totalMatch, totalWins,
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
            if (
                error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'SQLITE_CONSTRAINT_UNIQUE'
            ) {
                return reply.code(409).send({
                    success: false,
                    message: 'A profile for this user already exists.',
                });
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

            const userProfile = await serv.dbUsers.get<UserStats>(query, [userID]);
            if (!userProfile)
                return reply.code(404).send({ success: false, message: 'User profile not found' });

            return reply.code(200).send({ success: true, userProfile });
        } catch (error) {
            serv.log.error(`Error fetching user profile: ${error}`);
            throw error;
        }
    });

    //update all stats of a user
    serv.patch('/stats/:userID', async (request, reply) => {
        try {
            const { userID } = request.params as { userID: string };
            const actions = request.body as { action: string; field: string; value: number }[];

            const currentStats = await serv.dbUsers.get<UserStats>(
                'SELECT * FROM userStats WHERE userID = ?',
                [userID]
            );
            if (!currentStats)
                return reply.code(404).send({ success: false, message: 'User not found.' });

            const updates: { [key: string]: number } = {};
            const validFields = [
                'totalMatch',
                'totalWins',
                'longestMatch',
                'shortestMatch',
                'longuestPass',
            ];

            for (const action of actions) {
                if (!validFields.includes(action.field)) continue;

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
                        if (
                            currentValue === undefined ||
                            currentValue === 0 ||
                            action.value < currentValue
                        )
                            updates[action.field] = action.value;
                        break;
                    }
                }
            }

            if (Object.keys(updates).length === 0)
                return reply.code(200).send({ success: true, message: 'No stats were updated.' });

            const setClauses = Object.keys(updates)
                .map((key) => `${key} = ?`)
                .join(', ');
            const params = [...Object.values(updates), userID];
            const query = `UPDATE userStats SET ${setClauses} WHERE userID = ?`;

            const response = await serv.dbUsers.run(query, params);
            if (!response.changes)
                return reply.code(404).send({
                    success: false,
                    message: 'User not found',
                });

            return reply
                .code(200)
                .send({ success: true, message: 'User stats updated successfully.' });
        } catch (error) {
            serv.log.error(`Error updating user stats: ${error}`);
            throw error;
        }
    });

    // TODO : Repeting route, check usage in BFF and switch it up with correct route
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



	//get username by userID
	serv.get('/:userID/username', async (request, reply) => {
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
