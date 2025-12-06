interface userInfo {
	userID?: string,
	username?: string,
	userSocket?: WebSocket
}

interface lobbyInfo {
	hostID?: string,
	lobbyID?: string,
	whitelist?: whitelist,
	joinable?: boolean,
	userList: Map<string, userInfo>,
	remote: boolean,
	format: 'quickmatch' | 'tournament' | string,
	nbPlayers: number
	// gameSettings?: string
}

interface whitelist {
	lobbyId: string,
	hostID: string,
	userIDs: Map<string, userInfo>
}

interface game {
	lobbyID: string,
	gameID: string,
	tournamentID?: string,
	remote: boolean,
	users: userInfo[] | undefined | null,
	score: [number, number],
	winnerID: string,
	loserID: string,
	duration: number,
	longuestPass: number,
	startTime: string,
}

interface tournament {
	tournamentID: string,
	winnerID: string | undefined | null,
	bracket: game[],
	nbPlayers: number
}

// NATS
interface user {
	userID: string,
	username: string,
}

interface gameReply {
	gameID: string,
	users: user[],
	remote: boolean
}

// PONG
interface gameRequest {
	opponent: string,
	gameID: string,
	remote: boolean,
}

export type { userInfo, lobbyInfo, whitelist, tournament, game, gameRequest, user, gameReply };