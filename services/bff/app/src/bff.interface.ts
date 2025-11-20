export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

export interface userData {
	avatar: string,
	biography: string,
	userID: string,
	lang: string,
	profileColor: string,
	//relation: ProfileView,
	status: boolean,
	username: string,
	winstreak: string, 
	since: string
}







/*----------  WIP  ----------*/

export type userStatus = 'offline' | 'online' | 'in-game';

export interface ProfileResponse {
	success: boolean;
	profile: UserProfile;
}

export interface Friends {
	friendID: string,
	statusFrienship: boolean,
	since: string,
	userData: userData,
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
	longuestPass: number;
	[key: string]: number;
}

export interface RawUserActivity { activityStatus: userStatus; }
export interface FriendshipStatus { status: ProfileView; }

export interface UserAuth {
	userID: number,
	username: string
}

export interface ProfileDataBatch {
	userID: number;
	username: string,
	avatar: string;
	biography: string;
	profileColor: string;
	winStreak: number;
}

export interface ProfileDataBatchResponse {
	success: boolean;
	profileData: ProfileDataBatch[];
	message?: string;
}


export interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biography: string;
	status: string
	profileColor: string;
}

export interface RawMatches {
	gameID: number;
	duration: number;
	startTime: string;
	winnerID: number;
	loserID: number;
	scoreWinner: number;
	scoreLoser: number;
	opponentID: number;
	tournament: number
}

export interface Matches {
	date: string;
	opponent: string;
	outcome: string;
	score: string;
	duration: string;
	tournament: boolean;
}

export interface UserProfileView {
	userData: userData
	stats: UserStats;
	friends: Friends[];
	recentMatches: Matches[];
}

export interface settings {
	defaultLang: string;
	profileColor: string;
	username: string;
	biography: string;
	password: string;
}

export type ProfileCreationResult =
	| { errorCode: 'success'; data: any }
	| { errorCode: 'conflict' }  // For 409
	| { errorCode: 'user_not_found' }; // For 404