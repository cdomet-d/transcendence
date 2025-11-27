interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}

interface lobbyInfo {
	lobbyID?: string,
	whitelist?: whitelist,
	joinable?: boolean,
    userList: Map<number, userInfo>,
	remote: boolean,
	format: "quickmatch" | "tournament" | string,
	nbPlayers: number
	// gameSettings?: string
}

interface whitelist {
	lobbyId: string,
	hostID: number,
	userIDs: number[]
}

interface game {
	lobbyID: string,
	gameID: string,
	tournamentID?: string,
	remote: boolean,
	users: userInfo[] | undefined | null,
	score: string,
	winnerID: number,
	loserID: number,
	duration: number,
	longuestPass: number
}

interface tournament {
	tournamentID: string,
	winnerID: number | undefined | null,
	bracket: game[]
}

interface gameRequest {
	username: string,
	userID: number,
	gameID: string,
	remote: boolean
}

export type { userInfo, lobbyInfo, whitelist, tournament, game, gameRequest };