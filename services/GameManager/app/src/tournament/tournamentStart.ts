import { natsPublish } from "../nats/publisher.js";
import type { game, tournament } from '../../src/manager.js'

// Temporary solution: store tournaments in memory
export let tournamentMap: Map<number, tournament> = new Map();

export function startTournament(tournamentObj: tournament) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
	startFirstRound(tournamentObj);
}

// Can I use this loop for later tournament stages?
// or just loop (players / 2) times for first round
// and start games 1 by 1 after in tournamentRoutine
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