import { createBracket, createTournament } from "./tournament/tournament.js";
import { startTournament } from "./tournament/tournamentRoutine.js";

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
        const tournament: tournament | undefined = createTournament(lobbyInfo);
        if (tournament === undefined) {
            console.log("Error: tournament Creation");
            return;
        }
        startTournament(tournament);
    } else if (lobbyInfo.format === "quick") {
        // create matchObj
        // send it to PONG
        // wait for approval from PONG
        // signal involved clients match ready for them
    }
}