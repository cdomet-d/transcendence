import { createTournament } from "./tournament/tournamentCreation.js";
import { startGame, startTournament } from "./tournament/tournamentStart.js";
import type { lobbyInfo } from './lobby/lobby.js'
import { createGameObj } from "./quickmatch/createGame.js";

interface userInfo {
	userID?: number,
	username?: string
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
	duration: number,
    longuestPass: number
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

export type { userInfo, game, tournament, gameRequest }

export function processGameRequest(lobbyInfo: lobbyInfo) {
	if (lobbyInfo.format === "tournament") {
		const tournament: tournament | undefined = createTournament(lobbyInfo);
		if (tournament === undefined) {
			console.log("Error: Could not create tournament");
			return;
		}
		lobbyInfo.joinable = false; // TODO: turn back to true when tournament over
		startTournament(tournament);
	} else if (lobbyInfo.format === "quick") {
		const quickmatch: game | boolean = createGameObj(lobbyInfo);
		if (quickmatch === false) {
			console.log("Error: Something went wrong!");
			return;
		}
		lobbyInfo.joinable = false; // TODO: turn back to true when game over
		startGame(quickmatch);
	}
}