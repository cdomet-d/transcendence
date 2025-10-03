import { match } from "assert";
import { natsPublish } from "../nats/publisher.js";
import { Mutex } from 'async-mutex';

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


// Temporary solution: store tournaments in memory
let tournamentMap: Map<number, tournament> = new Map();
let mutexMap: Map<number, Mutex> = new Map();

export function startTournament(tournamentObj: tournament) {
    tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
    startFirstRound(tournamentObj);
}

function startFirstRound(tournament: tournament) {
    if (tournament.bracket && Array.isArray(tournament.bracket)) {
        for (let i = 0; tournament.bracket[i]?.users !== null; i++) {
            const match = tournament.bracket[i];
            if (match && match.users && match.users.length > 0) {
                startMatch(match);
            }
        }
    }
}

export function startMatch(match: match) {
    natsPublish("game.request", JSON.stringify(match), "game.reply");
}

function getTournamentMutex(tournamentID: number): Mutex {
    if (!mutexMap.has(tournamentID)) {
        mutexMap.set(tournamentID, new Mutex());
    }
    return mutexMap.get(tournamentID)!;
}

export async function tournamentState(payload: string) {
    const previousMatch: match = JSON.parse(payload);
    const tournamentID: number = previousMatch.tournamentID;

    const mutex = getTournamentMutex(tournamentID);
    const release = await mutex.acquire(tournamentID);

    try {
        const tournamentObj = tournamentMap.get(previousMatch.tournamentID);
        if (!tournamentObj) {
            console.log("No tournamentObj qué?");
            return;
        }

        // update previousMatch info in bracket
        let i = 0;
        for (; tournamentObj.bracket[i]?.matchID !== previousMatch.matchID; i++) { }
        if (tournamentObj.bracket[i]?.matchID === previousMatch.matchID) {
            tournamentObj.bracket[i] = previousMatch;
        }

        // send full matchObj to DB

        // IF TOURNAMENT OVER
        const nextMatch = getNextMatchInBracket(tournamentObj);
        if (nextMatch === undefined) { // Means previousMatch was the tournament final
            // handle end of tournament
        }

        // IF NOT
        const nextPlayer: string = getUsernameFromID(previousMatch.winnerID, previousMatch);
        if (nextMatch?.users === null) { // assign winnerID to player1 of next match
            nextMatch.users = [
                { userID: previousMatch.winnerID, username: nextPlayer },
                {}
            ];
        } else if (nextMatch?.users && nextMatch?.users[1] === null) { // assign winnerID to player2 of next match
            nextMatch.users[1] = { userID: previousMatch.winnerID, username: nextPlayer };
        }
    } finally {
        release();
    }

    // waiting screen for winner
    // back to menu for loser

    // when ready startMatch()
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