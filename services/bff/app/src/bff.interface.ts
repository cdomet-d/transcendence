export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type userStatus = 'offline' | 'online' | 'in-game';

export interface ProfileResponse {
	success: boolean;
	profile: UserProfile;
}

export interface userData {
	avatar: string,
	biography: string,
	userID: string,
	language: string,
	profileColor: string,
	relation: ProfileView,
	status: userStatus,
	username: string,
	since: string
}

export interface Friends {
	friendID: string,
	since: string
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

export interface RawUserActivity { activityStatus: userStatus; }
export interface FriendshipStatus { status: ProfileView; }

export interface UserAuth {
	userID: number,
	username: string
}

export interface ProfileData {
	avatar: string,
	biography: string,
	profileColor: string,
	winstreak: string,
}

export interface ProfileDataResponse {
	success: boolean;
	profileData: ProfileData;
	message?: string;
}

export interface ProfileDataBatch {
	userID: number;
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


export interface AccountDataBatchResponse {
	success: boolean;
	accountData: AccountData[];
	message?: string;
}

export interface AccountDataResponse {
	success: boolean;
	accountData: AccountData;
	message?: string;
}

export interface AccountData {
	username: string,
	registerDate: string,
	userID: string,
	userStatus: userStatus,
	defaultLang: string
}

export interface profileData {
	avatar: string,
	biography: string,
	language: string,
	profileColor: string,
	relation: ProfileView,
	status: boolean;
	winstreak: string,
	since: string,
	userID: number;
	username: string;
}

export interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biographygraphy: string;
	profileColor: string;
}

export interface Matches {
	gameID: number;
	duration: number;
	startTime: string;
	winnerID: number;
	loserID: number;
	scoreWinner: number;
	scoreLoser: number;
	opponentID: number;
}

export interface UserProfileView {
	userData: userData
	profile: profileData;
	stats: UserStats;
	friends: ProfileDataBatch[];
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