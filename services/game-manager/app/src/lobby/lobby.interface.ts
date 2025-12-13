export interface JWTPayload {
    userID: string;
    username: string;
}

export interface lobbyRequestForm {
	action: string,
	format: string,
	userID: string,
	username: string,
	inviteeID?: string,
}

type GameType = '1 vs 1' | 'tournament';
export interface gameNotif {
	type: 'GAME_INVITE',
	senderUsername: string,
	receiverID: string,
    lobbyID: string,
	gameType: GameType,
}

export interface lobbyInviteForm {
	action: string,
	format: string,
	invitee: {userID: string, username?: string},
	hostID: string,
}

export interface lobbyJoinForm {
	action: string,
	format: string,
	invitee: {userID: string, username: string},
	lobbyID: string,
}

export interface lobbyDeclineForm {
	action: string,
	invitee: {userID: string, username?: string},
	lobbyID: string,
}