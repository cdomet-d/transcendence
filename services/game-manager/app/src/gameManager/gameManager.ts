import { createGameObj, startGame } from "../quickmatch/createGame.js";
import { createTournament } from "../tournament/tournamentCreation.js";
import { startTournament } from "../tournament/tournamentStart.js";
import type { game, lobbyInfo, tournament } from "./gameManager.interface.js";

export function processGameRequest(lobbyInfo: lobbyInfo) {
	if (lobbyInfo.format === "tournament") {
		const tournament: tournament | undefined = createTournament(lobbyInfo);
		if (tournament === undefined) {
			console.log("Error: Could not create tournament");
			return;
		}
		lobbyInfo.joinable = false; // TODO: turn back to true when tournament over
		startTournament(tournament);
	} else if (lobbyInfo.format === "quickmatch") {
		const quickmatch: game | undefined = createGameObj(lobbyInfo);
		if (quickmatch === undefined) {
			console.log("Error: Something went wrong!");
			return;
		}
		lobbyInfo.joinable = false; // TODO: turn back to true when game over (only for remote)
		startGame(quickmatch);
	}
}
