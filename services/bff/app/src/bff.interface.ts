import type { StringMappingType } from "typescript";

export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
export type StatusUser = 'offline' | 'online' | 'in-game';

export interface ProfileResponse {
	success: boolean;
	profile: UserProfile;
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

export interface RawUserActivity { activityStatus: StatusUser; }
export interface FriendshipStatus { status: ProfileView; }

export interface UserAuth {
	userID: number,
	username: string
}

export interface UserDataUser {
	avatar: string,
	bio: string,
	profileColor: string,
	winstreak: string,
}

export interface UserDataAccount {
	username: string,
	since: string,
	userID: string,
	status: string,
	language: string
}

export interface UserData {
	avatar: string,
	biography: string,
	language:string,
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
	profile: UserData;
	stats: UserStats;
	friends: UserData[];
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