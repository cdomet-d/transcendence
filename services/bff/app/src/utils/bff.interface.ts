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
	winStreak: string,
	since: string,
	totalWins: string,
	totalLosses: string,
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
    [key: string]: number | string;
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
	player1: string;
	player2: string;
	player1Score: number;
	player2Score: number;
	opponentID: string;
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
export interface Dictionary {
	buttons: {
		submit: string;
		cancel: string;
		search: string;
		delete: string;
		decline: string;
		play: string;
		leaderboard: string;
		profile: string;
		login: string;
		logout: string;
	};
	forms: {
		username: string;
		password: string;
		biography: string;
		avatar: string;
		search_placeholder: string;
	};
	titles: {
		settings: string;
		register: string;
		login: string;
		local_pong: string;
		remote_pong: string;
		tournament: string;
		home: string;
	};
	profile: {
		joined: string;
		friends: string;
		game_history: string;
		statistics: string;
		date: string;
		opponent: string;
		outcome: string;
		score: string;
		duration: string;
		tournament: string;
	};
	notifs: {
		notif_placeholder: string;
	};
	gameCustom: {
		ball_speed: string;
		paddle_size: string;
		paddle_speed: string;
		paddle_horizontal: string;
		opponent: string;
		start: string;
		local: string;
		remote: string;
		background: string;
		farm: string;
		under_water: string;
	};
	error: {
		username_error: string;
		password_error: string;
	}
}
