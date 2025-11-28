import { createTournament } from "./tournament/tournamentCreation.js";
import { startTournament } from "./tournament/tournamentStart.js";
import { createGameObj, startGame } from "./quickmatch/createGame.js";
import type { game, lobbyInfo, tournament } from "./manager.interface.js";

export function processGameRequest(lobbyInfo: lobbyInfo) {
	if (lobbyInfo.format === "tournament") {
		const tournament: tournament | undefined = createTournament(lobbyInfo);
		if (tournament === undefined) {
			console.log("Error: Could not create tournament");
			return;
		}
		postTournamentToDashboard(tournament);
		lobbyInfo.joinable = false; // TODO: turn back to true when tournament over
		startTournament(tournament);
	} else if (lobbyInfo.format === "quickmatch") {
        console.log("5");

		const quickmatch: game | undefined = createGameObj(lobbyInfo);
		if (quickmatch === undefined) {
			console.log("Error: Something went wrong!");
			return;
		}
		lobbyInfo.joinable = false; // TODO: turn back to true when game over
		startGame(quickmatch);
	}
}

async function postTournamentToDashboard(tournament: tournament) {
	const url = `http://dashboard:1515/tournament/`;
	const reqBody: { tournamentID: string, nbPlayers: number} = {
		tournamentID: tournament.tournamentID, 
		nbPlayers: tournament.nbPlayers, 
	};
	try {
		const response: Response = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(reqBody),
		});
		// TODO check response status ?	
		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /tournament/:tournamentID) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
}
