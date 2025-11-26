import type { FastifyInstance } from 'fastify';
import type { UserProfileView, JwtPayload } from './bff.interface.js';
import { fetchLeaderboard, searchBar, buildTinyProfile, fetchUserStats, fetchFriendships, processMatches } from './bffUserProfile.service.js';
//import { updatePassword, fetchUserDataAccount, updateUsername,  updateDefaultLang, deleteAccount, deleteUser  } from './bffAccount.service.js';
//import { deleteFriendship } from './bffFriends.service.js'

export async function bffUsersRoutes(serv: FastifyInstance) {

	//get's profile + stats + game + friendslist
	// userID -> userID of requested profile
	// get big profile with username
	// TODO : add tournaments 
	serv.get('/profile/:username', async (request, reply) => {
		try {

			//FOR CURL TESTING
			//if (request.headers['x-test-userid']) {
			//	(request as any).user = {
			//		userID: Number(request.headers['x-test-userid']),
			//		username: 'test_user'
			//	};
			//	serv.log.warn('[BFF] Using Dev Bypass for Auth');
			//}
			//else {

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
			//}
			const userB = request.user.userID;
			const { username } = request.params as { username: string };

			if (userB === undefined) {
				serv.log.error("[BFF] Parameter missing")
				return reply.code(400).send({
					message: '[BFF] Missing required query parameters: userA and userB are required.'
				});
			}
			const combinedUserData = await buildTinyProfile(serv.log, userB, username, token);

			if (!combinedUserData)
				return (reply.code(404).send({ message: 'User profile data not found.' }));

			const [
				userData,
				userStats,
				friends,
				pending,
				recentMatches
			] = await Promise.all([
				combinedUserData,
				fetchUserStats(serv.log, Number(combinedUserData.userID), token),
				fetchFriendships(serv.log, Number(combinedUserData.userID), 'friend', token),
				fetchFriendships(serv.log, Number(combinedUserData.userID), 'pending', token),
				processMatches(serv.log, Number(combinedUserData.userID), token)
			]);

			if (!userData || !userStats)
				return reply.code(404).send({ message: '[BFF] Failed to retrieve essential user data.' });

			const responseData: UserProfileView = {
				userData: userData,
				userStats: userStats,
				friends: friends || [],
				pending: pending || [],
				matches: recentMatches || []
			};

			return reply.code(200).send(responseData);

		} catch (error) {
			serv.log.error(`[BFF] Error building user profile view: ${error}`);
			throw (error);
		}
	});

	//TODO : I didn't add the JWT verif here because the front request that (not the user) so no JWT, right ?
	// should I tho ??
	serv.get('/tiny-profile/:username', async (request, reply) => {
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

			const { username: targetUsername } = request.params as { username: string };
			const { userID: viewerUserID } = request.user as { userID: number };

			if (!viewerUserID)
				return (reply.code(401).send({ message: 'Unauthorized.' }));

			const tinyProfile = await buildTinyProfile(serv.log, viewerUserID, targetUsername, token);

			if (!tinyProfile)
				return (reply.code(404).send({ message: 'User profile data not found.' }));

			return (reply.code(200).send(tinyProfile));

		} catch (error) {
			serv.log.error(`[BFF] Error building tiny profile: ${error}`);
			throw error;
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

			if (!query.name || query.name.trim() === '')
				return reply.code(200).send([]);

			const profiles = await searchBar(serv.log, query.name, token);

			return (reply.code(200).send(profiles));
		} catch (error) {
			serv.log.error(`[BFF] Error searching users: ${error}`);
			throw (error);
		}
	});

	serv.get('/leaderboard', async (request, reply) => {
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

			const leaderboard = await fetchLeaderboard(serv.log, token);
			return (reply.code(200).send(leaderboard));

		} catch (error) {
			serv.log.error(`[BFF] Error searching users: ${error}`);
			throw (error);

		}
	});

	/* 	serv.patch('/settings', async (request, reply) => {
			try {
	
				//TODO: userID is in the cookies so setup fastify JWT plugin and get userID this way
				const { userID } = request.user;
				const body = request.body as any;
	
				const updateTasks: Promise<void>[] = [];
	
				if (body.username)
					updateTasks.push(updateUsername(serv.log, userID, body.username));
				if (body.password) {
					const hashedPassword = await bcrypt.hash(body.password, 10);
					updateTasks.push(updatePassword(serv.log, userID, hashedPassword));
				}
				if (body.avatar)
					updateTasks.push(updateAvatar(serv.log, userID, body.avatar));
				if (body.biography)
					updateTasks.push(updateBio(serv.log, userID, body.biography));
				if (body.profileColor)
					updateTasks.push(updateProfileColor(serv.log, userID, body.profileColor));
				if (body.defaultLang)
					updateTasks.push(updateDefaultLang(serv.log, userID, body.defaultLang));
	
				if (updateTasks.length === 0)
					return reply.code(200).send({ message: '[BFF] No settings to update.' });
	
				try {
					await Promise.all(updateTasks);
					return reply.code(200).send({ message: '[BFF] Settings updated successfully.' });
	
				} catch (error) {
					if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 409) {
						const message = ('message' in error)
							? (error as { message: string }).message
							: '[BFF] Username is already taken.';
						return (reply.code(409).send({ message: message }));
					}
					throw error;
				}
			} catch (error) {
				serv.log.error(`[BFF] Failed to update settings: ${error}`);
				throw error;
			}
		});*/
}