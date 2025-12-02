export interface lobbyRequestForm {
	action: string,
	format: string,
	userID: number,
	inviteeID?: number,
	lobbyID?: string
}