export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type FriendshipStatus = 'friend' | 'pending';

export interface JwtPayload {
	userID: string;
	username: string;
	iat: number;
	exp: number;
}

export interface userData {
	avatar: string | null | undefined,
	biography: string,
	userID: string,
	lang: string,
	profileColor: string,
	relation: ProfileView,
	status: boolean,
	username: string,
	winstreak: string,
	since: string
}

export interface UserIDResponse {
	success: boolean;
	message: string;
	response: {
		userID: string;
		username: string;
	};
}

export interface userStats {
	userID: string;
	longestMatch: number;
	shortestMatch: number;
	totalMatch: number;
	totalWins: number;
	winStreak: number;
	averageMatchDuration: number;
	longuestPass: number;
	[key: string]: number;
}
export interface StatsResponse {
	success: boolean;
	stats: userStats;
}

export interface ProfileDataBatch {
	userID: string;
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

export interface UserProfileView {
	userData: userData
	userStats: userStats;
	friends: userData[];
	pending: userData[];
	matches: Matches[];
}

export interface Friendship {
	friendshipID: number;
	userID: string;
	friendID: number;
	startTime: string;
	statusFriendship: boolean; // true = accepted, false = pending
}

export interface UsernameResponse {
	success: boolean;
	usersNames: { userID: string, username: string }[];
}

export interface RawMatches {
	gameID: number;
	duration: number;
	startTime: string;
	player1: number;
	player2: number;
	player1Score: number;
	player2Score: number;
	opponentID: number;
	tournamentID: number
}

export interface Matches {
	date: string;
	opponent: string;
	outcome: string;
	score: string;
	duration: string;
	tournament: boolean;
}

export interface UserProfileUpdates {
	avatar?: string;
	biography?: string;
	profileColor?: string;
	defaultLang?: string;
}