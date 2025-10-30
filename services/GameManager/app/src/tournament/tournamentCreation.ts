import type { userInfo, game, tournament } from '../../src/manager.js'
import type { lobbyInfo } from '../lobby/lobby.js';

export function createTournament(payload: lobbyInfo): tournament | undefined {
	console.log("Creating Tournament");

	// const tournamentID = generateUniqueID();
	const tournamentID = 99;

	// create bracket
	const games: game[] | undefined = createBracket(payload, tournamentID);
	if (games === undefined) {
		console.log("Error: createBracket()")
		return undefined;
	}

	// create tournament
	const tournamentObj = makeTournamentObj(tournamentID, games);
	return tournamentObj;
}

export function createBracket(lobbyInfo: lobbyInfo, tournamentID: number): game[] | undefined {
	console.log("Creating Bracket");
	// const nBgames = lobbyInfo.users.length - 1;

	// Basic bracket format is: | A vs B | C vs D | winner of each goes to FINAL
	// TODO: this ugly af
	if (!lobbyInfo.userList[0] || !lobbyInfo.userList[1] || !lobbyInfo.userList[2] || !lobbyInfo.userList[3]) {
		console.log("Error: Empty userInfo");
		return undefined;
	}

	// TODO: suffle players in an array then assign opponents for smoking hot brackets
	let opponents: userInfo[][] = [
		[lobbyInfo.userList[0], lobbyInfo.userList[1]],
		[lobbyInfo.userList[2], lobbyInfo.userList[3]]
	];

	// TODO: need to generate unique gameIDs (fetch DB?)
	// create nbgame objects
	let games: game[] = [
		{ gameID: 1, tournamentID: tournamentID, remote: true, users: opponents[0], score: "", winnerID: 0, loserID: 0 },
		{ gameID: 2, tournamentID: tournamentID, remote: true, users: opponents[1], score: "", winnerID: 0, loserID: 0 },
		{ gameID: 3, tournamentID: tournamentID, remote: true, users: null, score: "", winnerID: 0, loserID: 0 },
	];

	return games;
}

export function makeTournamentObj(tournamentID: number, games: game[]): tournament {
	const tournament: tournament = {
		tournamentID: tournamentID,
		winnerID: null,
		bracket: games
	}
	return tournament;
}