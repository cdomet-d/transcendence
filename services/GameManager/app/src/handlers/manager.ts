import { makeTournamentObj } from "../tournament/tournament.js";

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
    users: userInfo[],
    score: string,
    winner: userInfo,
    loser: userInfo,
}

interface tournament {
    tournamentID: number,
    winnerID: number,
    bracket: match[]
}

function receiveLobbyInfo(): lobbyInfo {
    const userArray: userInfo[] = [
            { userID: 1, username: "sam" },
            { userID: 2, username: "alex" },
            { userID: 3, username: "cha" },
            { userID: 4, username: "coco" },
        ];
    const lobbyInfo: lobbyInfo = { users: userArray, remote: true, format: "tournament" };
    return lobbyInfo;
}

export function processLobbyRequest() {
    // Receive data
    const lobbyInfo = receiveLobbyInfo();

    // Filter request
    if (lobbyInfo.format === "tournament") {
        // create bracket (AKA matches[])
        const matches: match[] = createBracket(lobbyInfo);

        // create tournamentObj (use matches[] from createBracket())
        const tournament: tournament = createTournament();
        
    } else if (lobbyInfo.format === "quick") {
        // create matchObj
        // send to PONG
        // wait for approval from PONG
        // signal involved clients match ready for them
    }
}