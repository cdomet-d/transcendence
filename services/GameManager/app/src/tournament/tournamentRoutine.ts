import { tournamentMap } from "./tournamentStart.js";
import { Mutex } from 'async-mutex';
import { startMatch } from "./tournamentStart.js";

interface userInfo {
    userID?: number,
    username?: string
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

let mutexMap: Map<number, Mutex> = new Map();

function getTournamentMutex(tournamentID: number): Mutex {
    if (!mutexMap.has(tournamentID)) {
        mutexMap.set(tournamentID, new Mutex());
    }
    return mutexMap.get(tournamentID)!;
}

// Mutex zone
export async function tournamentState(payload: string) {
    const previousMatch: match = JSON.parse(payload);
    const tournamentID: number = previousMatch.tournamentID;

    const mutex = getTournamentMutex(tournamentID);
    const release = await mutex.acquire(tournamentID);

    // TODO: Throw new Error inside try block
    try {
        const tournamentObj = tournamentMap.get(previousMatch.tournamentID);
        if (!tournamentObj) {
            console.log("No tournamentObj qué?");
            return;
        }

        // find match object in bracket
        const index = tournamentObj.bracket.findIndex((match) => match.matchID === previousMatch.matchID);
        if (index !== -1) {
            // update previousMatch info
            tournamentObj.bracket[index] = previousMatch;
        } else {
            console.log("Match not found in tournament bracket qué?");
            return;
        }

        // send full matchObj to DB??

        // get next matchObj
        const nextMatch = getNextMatchInBracket(tournamentObj);
        if (nextMatch === undefined) { // Means previousMatch was the tournament final
            // handle end of tournament
                // winner screen
                // loser screen
                // tournament over menu 
            return;
        }

        // set up nextMatch
        const nextPlayer: string = getUsernameFromID(previousMatch.winnerID, previousMatch);
        if (nextMatch?.users === null) { // assign winnerID to player1 of next match
            nextMatch.users = [
                { userID: previousMatch.winnerID, username: nextPlayer },
                {}
            ];
        } else if (nextMatch?.users && nextMatch?.users[1] === null) { // assign winnerID to player2 of next match
            nextMatch.users[1] = { userID: previousMatch.winnerID, username: nextPlayer };
        }

        // start next match
        startMatch(nextMatch);
    } finally {
        release();
    }
    // waiting screen for winner
    // back to menu for loser
}

function getUsernameFromID(winnerID: number, previousMatch: match): string {

    
    if (previousMatch.users?.length === 2) {
        if (previousMatch.users[0]?.userID === winnerID)
            return previousMatch.users[0]?.username!;
        else
            return previousMatch.users[1]?.username!;
    }
    return "USER NOT FOUND";
}

function getNextMatchInBracket(tournament: tournament): match | undefined {
    tournament.bracket.forEach((matchObj) => {
        if (matchObj.users === null || (matchObj.users && matchObj.users[1] === null)) {
            return matchObj;
        }
    });
    return undefined;
}