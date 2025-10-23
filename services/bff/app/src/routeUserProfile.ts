import type { FastifyInstance } from 'fastify';
import type { UserProfileView } from './bff.interface.js';
import * as bcrypt from 'bcrypt';
import { fetchMatches, fetchUserProfile, fetchFriendList, fetchUserStats } from './bffUserProfile.service.js';
import { updatePassword, updateUsername, updateBio, updateProfileColor, updateDefaultLang, updateAvatar } from './bffAccount.service.js';

export async function bffUsersRoutes(serv: FastifyInstance) {

	//get's profile + stats + game + friendslist
	serv.get('/users/profile', async (request, reply) => {
		try {
			const [
				profile,
				stats,
				friends,
				recentMatches
			] = await Promise.all([
				fetchUserProfile(request.user.userID),
				fetchUserStats(request.user.userID),
				fetchFriendList(request.user.userID),
				fetchMatches(request.user.userID)
			]);

			//TODO change reply
			if (!profile || !stats)
				return reply.code(404).send({ message: '[BFF] Failed to retrieve essential user data.' });

			const responseData: UserProfileView = {
				profile: profile,
				stats: stats,
				friends: friends || [],
				recentMatches: recentMatches || []
			};

			return reply.code(200).send(responseData);

		} catch (error) {
			serv.log.error(`[BFF] Error building user profile view: ${error}`);
			return (reply.code(422).send({ message: '[BFF] A backend service is currently unavailable.' }));
		}
	});

	//TODO code route in user and account
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
			if (body.bio)
				updateTasks.push(updateBio(serv.log, userID, body.bio));
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
}