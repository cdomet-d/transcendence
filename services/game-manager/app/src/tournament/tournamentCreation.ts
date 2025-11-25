import type { userInfo, game, tournament } from '../manager.js'
import type { lobbyInfo } from '../lobby/lobby.js';

export function createTournament(payload: lobbyInfo): tournament | undefined {
	const tournamentID = 99;

	const games: game[] | undefined = createBracket(payload, tournamentID);
	if (games === undefined) {
		console.log("Error: Could not create tournament bracket!")
		return undefined;
	}

	const tournamentObj = makeTournamentObj(tournamentID, games);
	return tournamentObj;
}

export function createBracket(lobbyInfo: lobbyInfo, tournamentID: number): game[] | undefined {
	// const nBgames = lobbyInfo.users.length - 1;

	for (let i = 0; i < 4; i++) {
		if (!lobbyInfo.userList[i]) {
			console.log("Error: Empty userInfo!");
			return undefined;
		}
	}
	
	// Basic bracket format is: | A vs B | C vs D | winner of each goes to FINAL
	// TODO: suffle players in an array then assign opponents for smoking hot brackets
	let opponents: userInfo[][] = [
		[lobbyInfo.userList[0]!, lobbyInfo.userList[1]!],
		[lobbyInfo.userList[2]!, lobbyInfo.userList[3]!]
	];

	// TODO: need DB for unique gameIDs
	let games: game[] = [
		{ lobbyID: lobbyInfo.lobbyID!, gameID: 1, tournamentID: tournamentID, remote: true, userList: opponents[0], score: "", winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: 2, tournamentID: tournamentID, remote: true, userList: opponents[1], score: "", winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: 3, tournamentID: tournamentID, remote: true, userList: null, score: "", winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
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