interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}

interface lobbyInfo {
	lobbyID?: number,
	whitelist?: whitelist,
	joinable?: boolean,
    userList: Map<number, userInfo>,
	remote: boolean,
	format: "quick" | "tournament" | string,
	nbPlayers: number
	// gameSettings?: string
}

interface whitelist {
	lobbyId: number,
	hostID: number,
	userIDs: number[]
}

interface game {
	lobbyID: number,
	gameID: number,
	tournamentID?: number,
	remote: boolean,
	userList: userInfo[] | undefined | null,
	score: string,
	winnerID: number,
	loserID: number,
}

interface tournament {
	tournamentID: number,
	winnerID: number | undefined | null,
	bracket: game[]
}

interface gameRequest {
	userID: number,
	gameID: number,
	remote: boolean
}

export type { userInfo, lobbyInfo, whitelist, tournament, game, gameRequest };