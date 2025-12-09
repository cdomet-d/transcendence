import type { game, lobbyInfo, tournament, user, userInfo } from '../gameManager/gameManager.interface.js';
import { lobbyMap } from '../lobby/lobby.gm.js';

export function createTournament(payload: lobbyInfo, lobbyID: string): tournament | undefined {
	const tournamentID = crypto.randomUUID().toString();

	const games: game[] | undefined = createBracket(payload, tournamentID, lobbyID);
	if (games === undefined) {
		console.log('Error: Could not create tournament bracket!')
		return undefined;
	}

	const tournamentObj = makeTournamentObj(tournamentID, games, payload.nbPlayers);
	return tournamentObj;
}

export function createBracket(lobbyInfo: lobbyInfo, tournamentID: string, lobbyID: string): game[] | undefined {
	const usersArray: userInfo[] = Array.from(lobbyMap.get(lobbyID)!.userList.values());
	const users: user[] = [
		{userID: usersArray[0]!.userID!, username: usersArray[0]!.username! },
		{userID: usersArray[1]!.userID!, username: usersArray[1]!.username! },
		{userID: usersArray[2]!.userID!, username: usersArray[2]!.username! },
		{userID: usersArray[3]!.userID!, username: usersArray[3]!.username! },
	];

    if (usersArray.length < 4) { // magic number I know
        console.log('Error: Not enough players for tournament!');
        return undefined;
    }

    const shuffledUsers: userInfo[] = fisherYatesShuffle(users);

    const opponents: userInfo[][] = [
        [shuffledUsers[0]!, shuffledUsers[1]!],
        [shuffledUsers[2]!, shuffledUsers[3]!],
    ];

	const games: game[] = [
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: opponents[0], 
			score: [0, 0], winnerID: "", loserID: "", duration: 0, longuestPass: 0, startTime: "", gameSettings: lobbyInfo.gameSettings! },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: opponents[1], 
			score: [0, 0], winnerID: "", loserID: "", duration: 0, longuestPass: 0, startTime: "", gameSettings: lobbyInfo.gameSettings! },
		{ lobbyID: lobbyInfo.lobbyID!, gameID: crypto.randomUUID().toString(), 
			tournamentID: tournamentID, remote: true, users: null, 
			score: [0, 0], winnerID: "", loserID: "", duration: 0, longuestPass: 0, startTime: "", gameSettings: lobbyInfo.gameSettings! },
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