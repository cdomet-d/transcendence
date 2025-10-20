import { info } from 'console';
import type { FastifyInstance } from 'fastify';

import type { UserCard } from './bff.interface.js';
import type { RawUserProfile } from './bff.interface.js';
import type { RawUserStats } from './bff.interface.js';
import type { RawUserActivity } from './bff.interface.js';
import type { FriendshipStatus } from './bff.interface.js';

import { fetchFriendshipStatus } from './bffUser.service.js'

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

