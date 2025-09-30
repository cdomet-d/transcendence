
interface userInfo {
    userID: number,
    username: string
}

interface requestForm {
    format: "tournament",
    remote: boolean,
    players: number,
    users: userInfo[]
}

interface match {
    matchID: number,
    tournamentID: number,
    remote: boolean,
    users: userInfo[],
    score: string,
    winner: userInfo,
    loser: userInfo,
}

interface tournament {
    matches: match[],
    tournamentID: number,
    winnerID: number
}

export function createTournament(payload: string) {
    const requestForm = JSON.parse(payload);

    // create bracket
    const bracketObj = createBracket(requestForm);

    // create tournament
    const tournamentObj = makeTournamentObj(requestForm);

    // start routine
        // signal first match
        // track each tournament state
    ;
}

export function createBracket(form: any) {
    const matches = form.players - 1;
    console.log("Creating Bracket");

}

export function makeTournamentObj(form: any) {
    // make tournamentObject
    // give gameIDs
}