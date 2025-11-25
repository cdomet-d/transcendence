export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type FriendshipStatus = 'friend' | 'pending';


export interface userData {
	avatar: string,
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
		userID: number;
		username: string;
	};
}

export interface userStats {
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
export interface StatsResponse {
	success: boolean;
	stats: userStats;
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

export interface UserProfileView {
	userData: userData
	userStats: userStats;
	friends: userData[];
	pending: userData[];
	matches: Matches[];
}

export interface Friendship {
	friendshipID: number;
	userID: number;
	friendID: number;
	startTime: string;
	statusFriendship: boolean; // true = accepted, false = pending
}

export interface UsernameResponse {
	success: boolean;
	usersNames: { userID: number, username: string }[];
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

/*----------  WIP  ----------*/

export type userStatus = 'offline' | 'online' | 'in-game';

export interface ProfileResponse {
	success: boolean;
	profile: UserProfile;
}

export interface RawUserActivity { activityStatus: userStatus; }

export interface UserAuth {
	userID: number,
	username: string
}

export interface UserProfile {
	userID: number;
	username: string;
	avatar: string;
	biography: string;
	status: string
	profileColor: string;
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