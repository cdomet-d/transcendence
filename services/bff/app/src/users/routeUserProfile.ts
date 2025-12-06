import type { FastifyInstance } from 'fastify';
import type { UserProfileView, JwtPayload } from '../utils/bff.interface.js';
import { fetchFriendshipsPending, fetchLeaderboard, searchBar, buildTinyProfile, fetchUserStats, fetchFriendships, processMatches, updateAuthSettings, updateUserProfile } from './bffUserProfile.service.js';
import { profileGet, tinyProfileGet, searchGet, leaderboardGet, settingsPatch, usernameGet } from './bff.usersSchemas.js';
import { cleanInput, cleanBioInput, isUsernameSafe } from '../utils/sanitizer.js';

export async function bffUsersRoutes(serv: FastifyInstance) {
	//get's profile + stats + game + friendslist
	// userID -> userID of requested profile
	// get big profile with username
	//error handled
	serv.get('/profile/:username', { schema: profileGet }, async (request, reply) => {
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

			const userB = request.user.userID;
			const { username } = request.params as { username: string };

			const safeUsername = cleanInput(username);

			if (userB === undefined) {
				serv.log.error('[BFF] Parameter missing');
				return reply.code(400).send({
					message:
						'[BFF] Missing required query parameters: userA and userB are required.',
				});
			}
			const combinedUserData = await buildTinyProfile(serv.log, userB, safeUsername, token);

			if (!combinedUserData)
				return reply.code(404).send({ message: 'User profile data not found.' });

			const [userData, userStats, friends, pending, recentMatches] = await Promise.all([
				combinedUserData,
				fetchUserStats(serv.log, combinedUserData.userID, token),
				fetchFriendships(serv.log, combinedUserData.userID, 'friend', token),
				fetchFriendshipsPending(serv.log, combinedUserData.userID, 'pending', token),
				processMatches(serv.log, combinedUserData.userID, token),
			]);
			if (!userData || !userStats)
				return reply
					.code(404)
					.send({ message: '[BFF] Failed to retrieve essential user data.' });


			const responseData: UserProfileView = {
				userData: userData,
				userStats: userStats,
				friends: friends || [],
				pending: pending || [],
				matches: recentMatches || [],
			};

			console.log(JSON.stringify(responseData.pending));
			return reply.code(200).send(responseData);

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };
				if (customError.code === 404) return (reply.code(404).send({ message: 'User profile data not found.' }));
				if (customError.code === 401) return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
				if (customError.code === 400) return reply.code(400).send({ code: error.code, message: 'Unauthaurized' });

				serv.log.error(`[BFF] Error building user profile view: ${error}`);
				throw (error);
			}
		}
	});

	//error handled
	serv.get('/tiny-profile/:username', { schema: tinyProfileGet }, async (request, reply) => {
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

			const { username: targetUsername } = request.params as { username: string };
			const { userID: viewerUserID } = request.user as { userID: string };

			const safeTargetUsername = cleanInput(targetUsername);

			if (!viewerUserID) return reply.code(401).send({ message: 'Unauthorized.' });

			const tinyProfile = await buildTinyProfile(
				serv.log,
				viewerUserID,
				safeTargetUsername,
				token
			);

			if (!tinyProfile)
				return reply.code(404).send({ message: 'User profile data not found.' });

			return (reply.code(200).send(tinyProfile));

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };
				if (customError.code === 404) return (reply.code(404).send({ message: 'User profile data not found.' }));
				if (customError.code === 400) return (reply.code(400).send({ message: 'Unauthorized' }));
				if (customError.code === 401) return (reply.code(401).send({ message: 'Unauthorized' }));

				serv.log.error(`[BFF] Error building tiny profile: ${error}`);
				throw error;
			}
		}
	});

	//error handled
	serv.get('/search', { schema: searchGet }, async (request, reply) => {
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

			const query = request.query as { name?: string };
			const safeName = cleanInput(query.name || '').trim();
			if (!safeName || safeName.length === 0)
				return reply.code(200).send([]);
			if (!query.name || query.name.trim() === '')
				return reply.code(200).send([]);

			const profiles = await searchBar(serv.log, safeName, token);
			return (reply.code(200).send(profiles));

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };

				if (customError.code === 400) return (reply.code(400).send({ message: 'Unauthorized' }));
				if (customError.code === 401) return (reply.code(401).send({ message: 'Unauthorized' }));
			}
			serv.log.error(`[BFF] Error searching users: ${error}`);
			throw (error);

		}
	});

	//error handled
	serv.get('/leaderboard', { schema: leaderboardGet }, async (request, reply) => {
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

			const leaderboard = await fetchLeaderboard(serv.log, token);
			return (reply.code(200).send(leaderboard));

		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };

				if (customError.code === 400) return (reply.code(400).send({ message: 'Unauthorized' }));
				if (customError.code === 401) return (reply.code(401).send({ message: 'Unauthorized' }));
			}
			serv.log.error(`[BFF] Error searching leaderboard: ${error}`);
			throw (error);

		}
	});

	//error handled
	//TODO : sanitize but will wait for PR to be merged first 
	serv.patch('/settings', { schema: settingsPatch }, async (request, reply) => {
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

			const userID = request.user.userID;
			const body = request.body as any;

			const profileUpdates: any = {};
			const accountUpdates: any = {};

			if (body.avatar) profileUpdates.avatar = body.avatar;
			if (body.biography) profileUpdates.biography = body.biography;
			if (body.profileColor) profileUpdates.profileColor = body.profileColor;
			if (body.defaultLang) profileUpdates.lang = body.defaultLang;
			if (body.username) profileUpdates.username = body.username;

			if (body.password) accountUpdates.password = body.password;
			if (body.username) accountUpdates.username = body.username;

			const updateTasks: Promise<void>[] = [];

			if (Object.keys(profileUpdates).length > 0)
				updateTasks.push(updateUserProfile(serv.log, userID, profileUpdates, token));

			if (Object.keys(accountUpdates).length > 0)
				updateTasks.push(updateAuthSettings(serv.log, userID, accountUpdates, token));

			if (updateTasks.length === 0)
				return reply.code(200).send({ message: '[BFF] No settings to update.' });

			try {
				await Promise.all(updateTasks);
				return reply.code(200).send({ message: '[BFF] Settings updated successfully.' });

			} catch (error) {
				if (typeof error === 'object' && error !== null && 'code' in error) {
					const customError = error as { code: number, message: string };

					if (customError.code === 409) return reply.code(409).send({ message: customError.message || '[BFF] Conflict error. Username taken' });
					if (customError.code === 404) return reply.code(404).send({ message: customError.message || '[BFF] User/account not found.' });
					if (customError.code === 400) return reply.code(400).send({ message: customError.message || '[BFF] Bad Request.' });
					if (customError.code === 401) return reply.code(401).send({ message: customError.message || '[BFF] Unauthorized' });
				}
				throw error;
			}
		} catch (error) {
			serv.log.error(`[BFF] Failed to update settings: ${error}`);
			throw error;
		}
	});

	serv.get('/:username', { schema: usernameGet }, async (request, reply) => {
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

			const { username } = request.params as { username: string };
			const safeUsername = cleanInput(username);

			const response = await fetch('http://users:2626/username', {
				method: 'POST',
				headers: {
					'Cookie': `token=${token}`,
					'Content-Type': 'application/json',
					body: JSON.stringify(safeUsername)
				}
			});

			if (response.status === 401) {
				console.log("[BFF] Unauthaurized")
				reply.code(401).send({ code: response.status, message: '[BFF] Unauthaurized' });
			}
			if (response.status === 404) {
				console.log("[BFF] User not found")
				reply.code(404).send({ code: response.status, message: '[BFF] User not found' });
			}
			if (response.status === 400) {
				console.log("[BFF] Invalid query")
				reply.code(400).send({ code: response.status, message: '[BFF] Invalid query' });
			}

			reply.code(200).send({ response });

		} catch (error) {
			serv.log.error(`[BFF] Failed to update settings: ${error}`);
			throw error;
		}
	});
}
