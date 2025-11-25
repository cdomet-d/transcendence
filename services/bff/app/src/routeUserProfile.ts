import type { FastifyInstance } from 'fastify';
import type { UserProfileView } from './bff.interface.js';
import { fetchLeaderboard, searchBar, buildTinyProfile, fetchUserStats, fetchFriendships, processMatches } from './bffUserProfile.service.js';
//import { updatePassword, fetchUserDataAccount, updateUsername,  updateDefaultLang, deleteAccount, deleteUser  } from './bffAccount.service.js';
//import { deleteFriendship } from './bffFriends.service.js'


export async function bffUsersRoutes(serv: FastifyInstance) {

	//get's profile + stats + game + friendslist
	// userID -> userID of requested profile
	// get big profile with username
	serv.get('/profile/:username', async (request, reply) => {
		try {

			//TODO: userB ID is in the cookies so setup fastify JWT plugin and get userID this way
			const { username } = request.params as { username: string };
			const query = request.query as {
				userB?: number,
			};

			if (query.userB === undefined) {
				serv.log.error("[BFF] Parameter missing")
				return reply.code(400).send({
					message: '[BFF] Missing required query parameters: userA and userB are required.'
				});
			}
			const combinedUserData = await buildTinyProfile(serv.log, query.userB, username);

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
				fetchUserStats(serv.log, Number(combinedUserData.userID)),
				fetchFriendships(serv.log, Number(combinedUserData.userID), 'friend'),
				fetchFriendships(serv.log, Number(combinedUserData.userID), 'pending'),
				processMatches(serv.log, Number(combinedUserData.userID))
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

	serv.get('/tiny-profile/:username', async (request, reply) => {
		try {
			//FOR TESTING PURPOSES
			/* 			if (!request.user && request.headers['x-test-userid']) {
							(request as any).user = {
								userID: Number(request.headers['x-test-userid']),
								username: 'test_viewer'
							};
						} */
			const { username: targetUsername } = request.params as { username: string };
			const { userID: viewerUserID } = request.user as { userID: number };

			if (!viewerUserID)
				return (reply.code(401).send({ message: 'Unauthorized.' }));

			const tinyProfile = await buildTinyProfile(serv.log, viewerUserID, targetUsername);

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
			const query = request.query as { name?: string };

			if (!query.name || query.name.trim() === '')
				return reply.code(200).send([]);

			const profiles = await searchBar(serv.log, query.name);
			return (reply.code(200).send(profiles));
		} catch (error) {
			serv.log.error(`[BFF] Error searching users: ${error}`);
			throw (error);
		}
	});

	serv.get('/leaderboard', async (request, reply) => {
		try {
			const leaderboard = await fetchLeaderboard(log);
			
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

	/* 	serv.get('/tiny-profile/:username', async (request, reply) => {
			try {
	
				const { username: targetUsername } = request.params as { username: string };
				const { userID: viewerUserID } = request.user as { userID: number };
	
				if (!viewerUserID)
					return (reply.code(401).send({ message: 'Unauthorized.' }));
	
				const targetUserID = await fetchUserID(serv.log, targetUsername);
				if (!targetUserID)
					return (reply.code(404).send({ message: 'User profile data not found.' }));
	
				const [
					userData,
					relation
				] = await Promise.all([
					fetchUserData(serv.log, Number(targetUserID)),
					fetchProfileView(serv.log, viewerUserID, targetUserID),
				]);
	
				if (!userData)
					return reply.code(404).send({ message: 'User profile data not found.' });
	
				const combinedUserData: userData = {
					userID: String(targetUserID),
					username: userData.username,
					avatar: userData.avatar,
					biography: userData.biography,
					profileColor: userData.profileColor,
					since: userData.since,
					status: userData.status,
					winstreak: userData.winstreak,
					lang: userData.lang,
					relation: relation,
				};
	
				return (reply.code(200).send(combinedUserData));
	
			} catch (error) {
				if (typeof error === 'object' && error !== null && 'message' in error &&
					(error as { message: string }).message.includes('User data not found'))
					return (reply.code(404).send({ message: 'User not found.' }));
				if (error instanceof Error)
					serv.log.error(`[BFF] Failed to build user profile: ${error.message}`);
				else
					serv.log.error(`[BFF] Failed to build user profile: An unknown error occurred.`);
				throw (error);
			}
		}); */

	/* 	serv.delete('/delete-account', async (request, reply) => {
			try {
				const userID = request.user.userID;
	
				//UNCOMMENT FOR PASSWORD CHECK FOR ACCOUNT DELETION
	
				//const username = request.user.username;
				//const { password } = request.body as { password: string };
				//if (!password) {
				//	return (reply.code(400).send({ message: '[BFF] Password is required.' }));
				//const validationResponse = await validateCredentials(username, password);
				//if (!validationResponse)
				//	return (reply.code(401).send({ message: '[BFF] Invalid credentials.' }));
	
				const deletionResults = await Promise.allSettled([
					deleteFriendship(serv.log, userID),
					deleteUser(serv.log, userID),
					deleteAccount(serv.log, userID)
				]);
	
				const failures = deletionResults.filter(response => response.status === 'rejected');
	
				if (failures.length > 0) {
					serv.log.error({
						msg: `[CRITICAL][BFF] Partial deletion for userID: ${userID}.`,
						failures: failures.map(f => (f as PromiseRejectedResult).reason?.message || f.reason)
					});
					throw new Error('[BFF] Failed to completely delete account. Please contact support.') ;
				}
	
				return (reply.code(204).send());
	
			} catch (error) {
				serv.log.error(`[BFF] Error during account deletion: ${error}`);
				throw (error);
			}
		}); */
}