import type { game, tournament } from "../manager.interface.js";
import { natsPublish } from "../nats/publisher.js";

// Temporary solution: store tournaments in memory
export const tournamentMap: Map<number, tournament> = new Map();

export function startTournament(tournamentObj: tournament) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
	startFirstRound(tournamentObj);
}

function startFirstRound(tournament: tournament) {
	if (tournament.bracket && Array.isArray(tournament.bracket)) {
		for (let i = 0; tournament.bracket[i]?.userList !== null; i++) {
			const game = tournament.bracket[i];
			if (game && game.userList && game.userList.length > 0) {
				startGame(game);
			}
		}
	}
}

export function startGame(game: game) {
	natsPublish("game.request", JSON.stringify(game), "game.reply");
}