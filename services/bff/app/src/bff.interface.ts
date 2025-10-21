export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type StatusUser = 'offline' | 'online' | 'in-game';

export interface ProfileResponse {
	success: boolean;
	profile: UserProfile;
}

export interface StatsResponse {
	success: boolean;
	stats: UserStats;
}

export interface UserStats {
	userID: number;
	longestMatch: number;
	shortestMatch: number;
	totalMatch: number;
	totalWins: number;
	winStreak: number;
	averageMatchDuration: number;
	highestScore: number;
	[key: string]: number;
}

export interface UserCard {
	id: number;
	username: string;
	avatar: string;
	biography: string;
	winstreak: number;
	status: StatusUser
	relation: ProfileView;
}

export interface RawUserStats { winStreak: number; }
export interface RawUserActivity { activityStatus: StatusUser; }
export interface FriendshipStatus { status: ProfileView; }

export interface UserData {
	userID: number;
	username: string;
}

export interface Friend {
	otherUserID: number;
	startTime: string;
}

export interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biography: string;
	profileColor: string;
}

//TODO: complete with all the profile card parameters
export interface FriendProfileCard {
	username: string;
	avatar: string;
	biography: string;
	friendship: {
		friendsSince: string;
	};
}

export interface Matches {

}