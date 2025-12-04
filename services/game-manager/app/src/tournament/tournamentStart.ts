import { fetch } from "undici";
import type { tournament } from "../gameManager/gameManager.interface.js";
import { startGame } from "../quickmatch/createGame.js";
import type { FastifyInstance } from "fastify";

export const tournamentMap: Map<string, tournament> = new Map();

export function startTournament(serv: FastifyInstance, tournamentObj: tournament) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
	startFirstRound(serv, tournamentObj);
	postTournamentToDashboard(tournamentObj);
}

function startFirstRound(serv: FastifyInstance, tournament: tournament) {
	if (tournament.bracket && Array.isArray(tournament.bracket)) {
		for (let i = 0; tournament.bracket[i]?.users !== null; i++) {
			const game = tournament.bracket[i];
			if (game && game.users && game.users.length > 0) {
				startGame(serv, game);
			}
		}
	}
}

async function postTournamentToDashboard(tournament: tournament) {
	const url = `http://dashboard:1515/tournament`;
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
		console.error(`[GM] Dashboard service (via route /tournament) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
};
