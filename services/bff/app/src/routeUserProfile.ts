import type { FastifyInstance } from 'fastify';
import type { UserProfileView, userData } from './bff.interface.js';
import * as bcrypt from 'bcrypt';
import { fetchProfileData, buildFullUserData, fetchUserID, processMatches, fetchFriendList, fetchUserStats, fetchRelationship } from './bffUserProfile.service.js';
import { updatePassword, fetchUserDataAccount, updateUsername, updateBio, updateProfileColor, updateDefaultLang, updateAvatar } from './bffAccount.service.js';



export async function bffUsersRoutes(serv: FastifyInstance) {

	//get's profile + stats + game + friendslist
	serv.get('/bff/profile', async (request, reply) => {
		try {

			serv.log.error("here");
			const query = request.query as {
				userA?: number,
				userB?: number,
			};

			if (query.userA === undefined || query.userB === undefined) {
				return reply.code(400).send({
					message: '[BFF] Missing required query parameters: userA and userB are required.'
				});
			}

			const [
				userData,
				stats,
				friends,
				recentMatches
			] = await Promise.all([
				buildFullUserData(serv.log, query.userA, query.userB),
				fetchUserStats(serv.log, query.userA),
				fetchFriendList(serv.log, query.userA),
				processMatches(serv.log, query.userA)
			]);

			if (!userData || !stats)
				return reply.code(404).send({ message: '[BFF] Failed to retrieve essential user data.' });

			const responseData: UserProfileView = {
				userData: userData,
				stats: stats,
				friends: friends || [],
				recentMatches: recentMatches || []
			};

			return reply.code(200).send(responseData);

		} catch (error) {
			serv.log.error(`[BFF] Error building user profile view: ${error}`);
			throw (error);
		}
	});

	serv.patch('/users/settings', async (request, reply) => {
		try {
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
	});

	serv.get('/friends/friendslist', async (request, reply) => {
		try {
			const friendsList = await fetchFriendList(serv.log, request.user.userID);

			serv.log.error(`zebi`);
			return (reply.code(200).send(friendsList));

		} catch (error) {
			serv.log.error(`[BFF] Error fetching friends list: ${error}`);
			throw (error);
		}
	});

	serv.get('/users/card/:username', async (request, reply) => {
		try {
			const { username: targetUsername } = request.params as { username: string };
			const { userID: viewerUserID } = request.user as { userID: number };

			if (!viewerUserID)
				return (reply.code(401).send({ message: 'Unauthorized.' }));

			const targetUserID = await fetchUserID(serv.log, targetUsername);

			const [
				AccountData,
				ProfileData,
				relation
			] = await Promise.all([
				fetchUserDataAccount(serv.log, Number(targetUserID)),
				fetchProfileData(serv.log, Number(targetUserID)),
				fetchRelationship(serv.log, viewerUserID, targetUsername),
			]);

			const combinedUserData: userData = {
				userID: String(targetUserID),
				username: AccountData.username,
				avatar: ProfileData.avatar,
				biography: ProfileData.biography,
				profileColor: ProfileData.profileColor,
				language: AccountData.defaultLang,
				since: AccountData.registerDate,
				status: ProfileData.userStatus,
				winstreak: ProfileData.winstreak,
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
	});
}