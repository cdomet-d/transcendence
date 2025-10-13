import type { userInfo, lobbyInfo, match, tournament } from '../../src/manager.js'

export function createTournament(payload: lobbyInfo): tournament | undefined {
    console.log("Creating Tournament");

    // const tournamentID = generateUniqueID();
    const tournamentID = 99;

    // create bracket
    const matches: match[] | undefined = createBracket(payload, tournamentID);
    if (matches === undefined) {
        console.log("Error: createBracket()")
        return undefined;
    }

    // create tournament
    const tournamentObj = makeTournamentObj(tournamentID, matches);
    return tournamentObj;
}

export function createBracket(lobbyInfo: lobbyInfo, tournamentID: number): match[] | undefined {
    console.log("Creating Bracket");
    // const nBmatches = lobbyInfo.users.length - 1;

    // Basic bracket format is: | A vs B | C vs D | winner of each goes to FINAL
    // TODO: this ugly af
    if (!lobbyInfo.users[0] || !lobbyInfo.users[1] || !lobbyInfo.users[2] || !lobbyInfo.users[3]) {
        console.log("Error: Empty userInfo");
        return undefined;
    }
    
    // TODO: suffle players in an array then assign opponents for smoking hot brackets
    let opponents: userInfo[][] = [
        [lobbyInfo.users[0], lobbyInfo.users[1]],
        [lobbyInfo.users[2], lobbyInfo.users[3]]
    ];
    
    // TODO: need to generate unique gameIDs (fetch DB?)
    // create nbMatch objects
    let matches: match[] = [
        { matchID: 1, tournamentID: tournamentID, remote: true, users: opponents[0], score: "", winnerID: 0, loserID: 0 },
        { matchID: 2, tournamentID: tournamentID, remote: true, users: opponents[1], score: "", winnerID: 0, loserID: 0 },
        { matchID: 3, tournamentID: tournamentID, remote: true, users: null, score: "", winnerID: 0, loserID: 0 },
    ];

    return matches;
}

export function makeTournamentObj(tournamentID: number, matches: match[]): tournament {
    const tournament: tournament = {
        tournamentID: tournamentID,
        winnerID: null,
        bracket: matches
    }
    return tournament;
}