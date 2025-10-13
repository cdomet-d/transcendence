import { createTournament } from "./tournament/tournamentCreation.js";
import { startTournament } from "./tournament/tournamentStart.js";

interface userInfo {
    userID?: number,
    username?: string
}

interface lobbyInfo {
    users: userInfo[],
    remote: boolean,
    format: "quick" | "tournament"
    // gameSettings: gameSettingsObj
}

interface game {
    gameID: number,
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
    bracket: game[]
}

export type { userInfo, lobbyInfo, game, tournament };

// function receiveLobbyInfo(): lobbyInfo {
//     const userArray: userInfo[] = [
//             { userID: 1, username: "sam" },
//             { userID: 2, username: "alex" },
//             { userID: 3, username: "cha" },
//             { userID: 4, username: "coco" }
//         ];
//     const lobbyInfo: lobbyInfo = { users: userArray, remote: true, format: "tournament" };
//     return lobbyInfo;
// }

export function processLobbyRequest(lobbyInfo: lobbyInfo) {
    // Filter request
    if (lobbyInfo.format === "tournament") {
        const tournament: tournament | undefined = createTournament(lobbyInfo);
        if (tournament === undefined) {
            console.log("Error: tournament object undefined!");
            return;
        }
        startTournament(tournament);
    } else if (lobbyInfo.format === "quick") {
        // create gameObj
        // send it to PONG
        // wait for approval from PONG
        // signal involved clients game ready for them
    }
}