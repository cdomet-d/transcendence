import { tournamentMap } from './tournamentStart.js';
import type { game, lobbyInfo, tournament } from '../gameManager/gameManager.interface.js';
import { gameOver } from '../quickmatch/gameOver.js';
import { tournamentOver } from './tournamentOver.js';
import type { FastifyInstance } from 'fastify';
import { lobbyMap } from '../lobby/lobby.gm.js';

// const nextPlayersMap: Map<string, { player1?: userInfo, player2?: userInfo }> = new Map();

export async function tournamentState(serv: FastifyInstance, game: game) {
	const tournamentObj: tournament | undefined = tournamentMap.get(game.tournamentID!);
	if (!tournamentObj) {
		// console.log(`${tournamentObj}`)
		// console.log('Error: Could not make tournamentObj!');
		return;
	}
	const lobby: lobbyInfo | undefined = lobbyMap.get(tournamentObj.lobbyID);
	if (lobby === undefined) return;

	const index = tournamentObj.bracket.findIndex((obj) => obj.gameID === game.gameID);
	if (index === -1) {
		// console.log('Error: game not found in tournament bracket!');
		return;
	}

	tournamentObj.nextGame = getNextGameInBracket(tournamentObj, game);
	if (tournamentObj.nextGame === undefined) {
		tournamentObj.winnerID = game.winnerID;
		gameOver(game, serv, true, tournamentObj, undefined);
		tournamentOver(tournamentObj);
		return;
	}

	// set up nextGame
	const nextGameID = tournamentObj.nextGame.gameID;

	let nextPlayers = tournamentObj.nextPlayersMap.get(nextGameID);
	if (!nextPlayers) {
		nextPlayers = {};
		tournamentObj.nextPlayersMap.set(nextGameID, nextPlayers);
	}

	const username: string = getUsernameFromID(game.winnerID, game);
	if (index % 2 === 0) {
		nextPlayers.player1 = { userID: game.winnerID, username: username };
	} else {
		nextPlayers.player2 = { userID: game.winnerID, username: username };
	}

	if (!nextPlayers.player1 || !nextPlayers.player2)
		gameOver(game, serv, false, tournamentObj, undefined);

	if (nextPlayers.player1 && nextPlayers.player2) {
		tournamentObj.bracket[index] = game; // update local tournamentObj
		tournamentObj.nextGame.users = [nextPlayers.player1, nextPlayers.player2];
		gameOver(game, serv, false, tournamentObj, tournamentObj.nextGame);
		tournamentObj.nextPlayersMap.delete(nextGameID);
	}
}

function getUsernameFromID(userID: string, game: game): string {
	if (game.users?.length === 2) {
		if (game.users[0]?.userID === userID)
			return game.users[0]?.username!;
		else
			return game.users[1]?.username!;
	}
	return 'Error: Could not find username from userID in gameObj!';
}

function getNextGameInBracket(tournament: tournament, game: game): game | undefined {
	if (tournament.bracket[2]?.gameID !== game.gameID) {
		return tournament.bracket[2];
	}
	return undefined;
}
