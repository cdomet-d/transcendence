import { createTournament } from "./tournament/tournamentCreation.js";
import { startTournament } from "./tournament/tournamentStart.js";
import type { lobbyInfo } from './lobby/lobby.js'


interface userInfo {
	userID?: number,
	username?: string
}

// interface lobbyInfo {
// 	remote: boolean,
// 	format: "quick" | "tournament",
// 	users: userInfo[],
// 	players: number
// 	// gameSettings: gameSettingsObj
// }

interface game {
	gameID: number,
	tournamentID: number,
	remote: boolean,
	users: userInfo[] | undefined | null,
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
	event: string,
	userID: number,
	gameID: number
}

export type { userInfo, game, tournament, gameRequest }

export function processGameRequest(lobbyInfo: lobbyInfo) {
	// Filter request
	if (lobbyInfo.format === "tournament") {
		const tournament: tournament | undefined = createTournament(lobbyInfo);
		if (tournament === undefined) {
			console.log("Error: tournament object undefined!");
			return;
		}
		startTournament(tournament);
	} else if (lobbyInfo.format === "quick") {
		// create gameObj
		// send it to PONG
		// wait for approval from PONG
		// signal involved clients game ready for them
	}
}