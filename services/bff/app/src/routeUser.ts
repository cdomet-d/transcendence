import type { FastifyInstance } from 'fastify';
import type { UserProfileView } from './bff.interface.js';
import * as bcrypt from 'bcrypt';
import { fetchMatches } from './bffGame.service.js';
import { fetchFriendList } from './bffFriends.service.js';
import { fetchUserStats } from './bffStats.service.js';
import { fetchUserProfile } from './bffUser.service.js';



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

			if (!profile || !stats)
				return reply.code(502).send({ message: 'Failed to retrieve essential user data.' });

			const responseData: UserProfileView = {
				profile: profile,
				stats: stats,
				friends: friends || [],
				recentMatches: recentMatches || []
			};

			return reply.code(200).send(responseData);

		} catch (error) {
			serv.log.error(`[BFF]Error building user profile view: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });

		}
	});

	//TODO code route in user and account
	serv.patch('/users/settings', async (request, reply) => {
		try {
			const user = request.user as { userID: number };
			if (!user || !user.userID)
				return reply.code(401).send({ message: 'Unauthorized' });

			const { userID } = user;
			const requestBody = request.body as any;
			const accountServicePayload: { [key: string]: any } = {};
			const profileServicePayload: { [key: string]: any } = {};

			if (requestBody.username && typeof requestBody.username === 'string')
				accountServicePayload.newUsername = requestBody.username;
			if (requestBody.password && typeof requestBody.password === 'string')
				accountServicePayload.newHashedPassword = await bcrypt.hash(requestBody.password, 10);
			if (requestBody.defaultLang && typeof requestBody.defaultLang === 'string')
				accountServicePayload.defaultLang = requestBody.defaultLang;
			if (requestBody.bio && typeof requestBody.bio === 'string')
				profileServicePayload.bio = requestBody.bio;
			if (requestBody.profileColor && typeof requestBody.profileColor === 'string')
				profileServicePayload.profileColor = requestBody.profileColor;

			const isAccountUpdate = Object.keys(accountServicePayload).length > 0;
			const isProfileUpdate = Object.keys(profileServicePayload).length > 0;

			if (!isAccountUpdate && !isProfileUpdate)
				return reply.code(400).send({ message: 'Bad Request: No valid fields provided for update.' });

			const apiCalls = [];

			if (isAccountUpdate) {
				const accountServiceUrl = `http://account-service:1414/internal/account/${userID}`;
				apiCalls.push(
					fetch(accountServiceUrl, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(accountServicePayload)
					})
				);
			}

			if (isProfileUpdate) {
				const profileServiceUrl = `http://profile-service:1515/internal/profile/${userID}`;
				apiCalls.push(
					fetch(profileServiceUrl, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(profileServicePayload)
					})
				);
			}

			const results = await Promise.allSettled(apiCalls);

			for (const result of results) {
				if (result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.ok)) {
					serv.log.error('A downstream service failed during settings update.', result);
					return reply.code(502).send({ message: 'Error while updating settings. Please try again.' });
				}
			}

			return reply.code(200).send({ message: 'Settings updated successfully.' });

		} catch (error) {
			serv.log.error(`BFF Error | /users/settings: ${error}`);
			return reply.code(500).send({ message: 'An internal server error occurred.' });
		}
	});
}


/*create user card
modify all user card info individualy
get userID by username 
get username by userID
get status user

export interface UserData {
	avatar: ImgMetadata;
	biography: string;
	relation: ProfileView;
	status: boolean;
	username: string;
	id: string;
	winstreak: string;
}*/

