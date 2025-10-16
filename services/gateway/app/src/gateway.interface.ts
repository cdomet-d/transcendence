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
	biography:string;
	//TODO: complete with all the profile card parameters
	friendship: {
		friendsSince: string;
	};
}