import { tournamentMap } from "./tournamentStart.js";
import type { game, tournament, userInfo } from "../manager.interface.js";
import { startGame } from "../quickmatch/createGame.js";
import { gameOver } from "../quickmatch/gameOver.js";
import { tournamentOver } from "./tournamentOver.js";

const nextPlayersMap: Map<string, { player1?: userInfo, player2?: userInfo }> = new Map();

export async function tournamentState(payload: string) {
	const game: game = JSON.parse(payload);

	const tournamentObj = tournamentMap.get(game.tournamentID!);
	if (!tournamentObj) {
		console.log("Error: Could not make tournamentObj!");
		return;
	}

	const index = tournamentObj.bracket.findIndex((obj) => obj.gameID === game.gameID);
	if (index === -1) {
		console.log("Error: game not found in tournament bracket!");
		return;
	}

	gameOver(game.gameID);

	const nextGame = getNextGameInBracket(tournamentObj);
	if (nextGame === undefined) { // tournament is over
		// handle end of tournament
		tournamentObj.winnerID = game.winnerID;
		tournamentOver(tournamentObj);
		return;
	}

	// set up nextGame
	const nextGameID = nextGame.gameID;

	let nextPlayers = nextPlayersMap.get(nextGameID);
	if (!nextPlayers) {
		nextPlayers = {};
		nextPlayersMap.set(nextGameID, nextPlayers);
	}

	const username: string = getUsernameFromID(game.winnerID, game);
	if (index % 2 === 0) { // game index in tournament
		nextPlayers.player1 = { userID: game.winnerID, username: username };
	} else {
		nextPlayers.player2 = { userID: game.winnerID, username: username };
	}

	if (nextPlayers.player1 && nextPlayers.player2) {
		tournamentObj.bracket[index] = game; // update local tournamentObj
		nextGame.users = [nextPlayers.player1, nextPlayers.player2];
		startGame(nextGame);
		nextPlayersMap.delete(nextGameID);
	}
}

function getUsernameFromID(userID: number, game: game): string {
	if (game.users?.length === 2) {
		if (game.users[0]?.userID === userID)
			return game.users[0]?.username!;
		else
			return game.users[1]?.username!;
	}
	return "Error: Couldn't find username from userID in gameObj!";
}

function getNextGameInBracket(tournament: tournament): game | undefined {
	tournament.bracket.forEach((gameObj) => {
		if (gameObj.users === null) {
			return gameObj;
		}
	});
	// TODO Find better way to verify if tournament is over?
	return undefined;
}