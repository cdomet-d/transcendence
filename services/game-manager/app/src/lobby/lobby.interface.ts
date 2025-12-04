export interface lobbyRequestForm {
	action: string,
	format: string,
	userID: string,
	inviteeID?: string,
	lobbyID?: string
}

type GameType = '1 vs 1' | 'tournament';
export interface gameNotif {
	type: 'GAME_INVITE',
	senderID: string,
	receiverID: string, //will be string eventually
    lobbyID: string,
	// gameType: GameType,
}
