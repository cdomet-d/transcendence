import { Agent, fetch } from "undici";
import type { tournament } from "../manager.interface.js";
import { startGame } from "../quickmatch/createGame.js";

export const tournamentMap: Map<string, tournament> = new Map();

export function startTournament(tournamentObj: tournament) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
	startFirstRound(tournamentObj);
	postTournamentToDashboard(tournamentObj);
}

function startFirstRound(tournament: tournament) {
	if (tournament.bracket && Array.isArray(tournament.bracket)) {
		for (let i = 0; tournament.bracket[i]?.users !== null; i++) {
			const game = tournament.bracket[i];
			if (game && game.users && game.users.length > 0) {
				startGame(game);
			}
		}
	}
}

const sslAgent = new Agent({
	connect: { rejectUnauthorized: false }
});

async function postTournamentToDashboard(tournamement: tournament) {
	const url = `https://dashboard:1515/tournament}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			dispatcher: sslAgent,
			body: JSON.stringify(tournamement),
		});
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /tournament) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}

	// TODO check response status ?

	if (!response.ok) {
		console.error(`[GM] Dashboard service failed with status: ${response.status}`);
		throw new Error(`Dashboard service failed with status ${response.status}`);
	}
};
