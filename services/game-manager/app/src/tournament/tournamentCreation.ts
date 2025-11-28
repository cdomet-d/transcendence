import type { game, lobbyInfo, tournament, userInfo } from '../manager.interface.js';

export function createTournament(payload: lobbyInfo): tournament | undefined {
	const tournamentID = crypto.randomUUID().toString();

	const games: game[] | undefined = createBracket(payload, tournamentID);
	if (games === undefined) {
		console.log("Error: Could not create tournament bracket!")
		return undefined;
	}

	const tournamentObj = makeTournamentObj(tournamentID, games, payload.nbPlayers);
	return tournamentObj;
}

export function createBracket(lobbyInfo: lobbyInfo, tournamentID: string): game[] | undefined {
	// const nBgames = lobbyInfo.userList.size; // if 8 players tournament

    const usersArray: userInfo[] = Array.from(lobbyInfo.userList.values());

    if (usersArray.length < 4) { // magic number I know
        console.log("Error: Not enough players for tournament!");
        return undefined;
    }
	
    const shuffledUsers: userInfo[] = fisherYatesShuffle(usersArray);

    const opponents: userInfo[][] = [
        [shuffledUsers[0]!, shuffledUsers[1]!],
        [shuffledUsers[2]!, shuffledUsers[3]!],
    ];

	const games: game[] = [
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: opponents[0], 
			score: [0, 0], winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: opponents[1], 
			score: [0, 0], winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: null, 
			score: [0, 0], winnerID: 0, loserID: 0, duration: 0, longuestPass: 0 },
	];

	return games;
}

function fisherYatesShuffle(usersArray: any) {
    const n = usersArray.length;
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
		[usersArray[i], usersArray[j]] = [usersArray[j], usersArray[i]];
    }
    return usersArray;
}


export function makeTournamentObj(tournamentID: string, games: game[], nbPlayers: number): tournament {
	const tournament: tournament = {
		tournamentID: tournamentID,
		winnerID: null,
		bracket: games,
		nbPlayers: nbPlayers,
	}
	return tournament;
}