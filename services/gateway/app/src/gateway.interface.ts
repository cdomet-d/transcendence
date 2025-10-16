export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type StatusUser = 'offline' | 'online' | 'in-game';

export interface UserCard {
	id: number;
	username: string;
	avatar: string;
	biography: string;
	winstreak: number;
	status: StatusUser
	relation: ProfileView;
}

export interface RawUserProfile {
	userID: number;
	username: string;
	avatar: string;
	biography: string;
}

export interface RawUserStats { winStreak: number; }
export interface RawUserActivity { activityStatus: StatusUser; }
export interface FriendshipStatus { status: ProfileView; }

export interface UserData {
	userID: number;
	username: string;
}

export interface RawFriend {
	otherUserID: number;
	startTime: string;
}

export interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biography: string;
	profileColor: string;
	rank: number;
}

export interface FriendProfileCard {
	username: string;
	avatar: string;
	biography: string;
	//TODO: complete with all the profile card parameters
	friendship: {
		friendsSince: string;
	};
}
