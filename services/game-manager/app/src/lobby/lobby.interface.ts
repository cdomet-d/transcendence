export interface lobbyRequestForm {
	action: string,
	format: string,
	userID: string,
	username: string,
	inviteeID?: string,//TODO: what is it for?
	lobbyID?: string
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
	lobbyID: string,
	hostID: string,
}