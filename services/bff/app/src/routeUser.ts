import { info } from 'console';
import type { FastifyInstance } from 'fastify';
import type { UserCard } from './bff.interface.js';
import type { RawUserStats } from './bff.interface.js';
import type { RawUserActivity } from './bff.interface.js';
import type { FriendshipStatus } from './bff.interface.js';

import { fetchUserStats } from './bffStats.service.js';
import { fetchUserProfile } from './bffUser.service.js';

export async function bffUsersRoutes(serv: FastifyInstance) {

	//get's profile + stats + game + friendslist
	serv.get('/users/profile', async (request, reply) => {
		try {
			const profile = [
				userCardResponse,
				statsResponse,
				friendslistResponse,
				gameResponse
			] = await Promise.all ([
				fetchUserProfile(request.user.userID),
				fetchUserStats(request.user.userID),
				fetchFriendList(request.user.userID),
				fetchMatches(request.user.userID)
			])

		} catch (error) {
			serv.log.error(`[BFF] Error finding user profile: ${error}`);
			return reply.code(503).send({ message: 'A backend service is currently unavailable.' });

		}
	})
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

