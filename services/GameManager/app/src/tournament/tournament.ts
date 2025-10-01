
interface userInfo {
    userID: number,
    username: string
}

interface lobbyInfo {
    users: userInfo[],
    remote: boolean,
    format: "quick" | "tournament"
    // gameSettings: gameSettingsObj
}

interface match {
    matchID: number,
    tournamentID: number,
    remote: boolean,
    users: userInfo[] | undefined | null,
    score: string,
    winnerID: number,
    loserID: number,
}

interface tournament {
    tournamentID: number,
    winnerID: number | undefined | null,
    bracket: match[]
}

export function createTournament(payload: lobbyInfo): tournament | undefined {
    console.log("Creating Tournament");

    // generate tournamentID
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

    
    // Basic format is A vs B and C vs D then winner of each goes to FINAL
    // TODO: this ugly af
    if (!lobbyInfo.users[0] || !lobbyInfo.users[1] || !lobbyInfo.users[2] || !lobbyInfo.users[3]) {
        console.log("Error: Empty userInfo");
        return undefined;
    }
    
    let opponents: userInfo[][] = [
        [lobbyInfo.users[0], lobbyInfo.users[1]],
        [lobbyInfo.users[2], lobbyInfo.users[3]]
    ];
    
    // generate gameIDs
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