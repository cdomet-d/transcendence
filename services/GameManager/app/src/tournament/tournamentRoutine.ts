import { tournamentMap } from "./tournamentStart.js";
import { Mutex } from 'async-mutex';
import { startGame } from "./tournamentStart.js";

import type { game, tournament } from '../../src/manager.js'

let mutexMap: Map<number, Mutex> = new Map();

function getTournamentMutex(tournamentID: number): Mutex {
	if (!mutexMap.has(tournamentID)) {
		mutexMap.set(tournamentID, new Mutex());
	}
	return mutexMap.get(tournamentID)!;
}

// Mutex zone
export async function tournamentState(payload: string) {
	const previousGame: game = JSON.parse(payload);
	const tournamentID: number = previousGame.tournamentID;

	const mutex = getTournamentMutex(tournamentID);
	const release = await mutex.acquire(tournamentID);

	// TODO: Throw new Error inside try block
	try {
		const tournamentObj = tournamentMap.get(previousGame.tournamentID);
		if (!tournamentObj) {
			console.log("Error: Could not make tournamentObj!");
			return;
		}

		// find game object in bracket
		const index = tournamentObj.bracket.findIndex((game) => game.gameID === previousGame.gameID);
		if (index !== -1) {
			// update previousGame info
			tournamentObj.bracket[index] = previousGame;
		} else {
			console.log("Error: previousGame not found in tournament bracket!");
			return;
		}

		// TODO: send full GameObj to DB??

		// get next GameObj
		const nextGame = getNextGameInBracket(tournamentObj);
		if (nextGame === undefined) { // Means previousGame was the tournament final
			// handle end of tournament
			// winner screen
			// loser screen
			// tournament over menu 
			return;
		}

		// set up nextGame
		const nextPlayer: string = getUsernameFromID(previousGame.winnerID, previousGame);
		if (nextGame?.users === null) { // assign winnerID to player1 of next game
			nextGame.users = [
				{ userID: previousGame.winnerID, username: nextPlayer },
				{}
			];
		} else if (nextGame?.users && nextGame?.users[1] === null) { // assign winnerID to player2 of next game
			nextGame.users[1] = { userID: previousGame.winnerID, username: nextPlayer };
		} else {
			// TODO: handle error
			return;
		}

		// start next game
		startGame(nextGame);
	} finally {
		release();
	}
	// waiting screen for winner
	// back to menu for loser
}

function getUsernameFromID(winnerID: number, previousGame: game): string {
	if (previousGame.users?.length === 2) {
		if (previousGame.users[0]?.userID === winnerID)
			return previousGame.users[0]?.username!;
		else
			return previousGame.users[1]?.username!;
	}
	return "Error: Couldn't find username from userID in previousGameObj!";
}

function getNextGameInBracket(tournament: tournament): game | undefined {
	tournament.bracket.forEach((GameObj) => {
		if (GameObj.users === null || (GameObj.users && GameObj.users[1] === null)) {
			return GameObj;
		}
	});
	return undefined;
}