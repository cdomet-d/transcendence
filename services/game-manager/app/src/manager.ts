import { createTournament } from "./tournament/tournamentCreation.js";
import { startGame, startTournament } from "./tournament/tournamentStart.js";
import { createGameObj } from "./quickmatch/createGame.js";
import type { game, tournament, lobbyInfo } from "./manager.interface.js";

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