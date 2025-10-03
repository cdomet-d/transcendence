import { match } from "assert";
import { natsPublish } from "../nats/publisher.js";

interface userInfo {
    userID: number,
    username: string
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
let tournamentMap: Map<Number, tournament> = new Map();

export function startTournament(tournamentObj: tournament) {
    // need async?
    // send match to PONG
    // await approval
    // signal clients

    startFirstRound(tournamentObj);
    tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
    // THEN tournamentState will be called via NATS "game.over" when needed and handle its bidnis 
}

function startFirstRound(tournament: tournament) {
    if (tournament.bracket && Array.isArray(tournament.bracket)) {
        for (let i = 0; i < tournament.bracket.length; i++) {
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

export function tournamentState(payload: string) {
    const currentMatch = JSON.parse(payload);

    // receive currentMatch updated with winner and loser

    // retrieve tournamentObj
    const tournamentObj = tournamentMap.get(currentMatch.tournamentID);
    if (!tournamentObj) {
        console.log("No tournamentObj qué?");
        return;
    }

    // update bracket
    // currentMatch is up to date, add it to bracket
    let i = 0;
    for (;tournamentObj.bracket[i]?.matchID !== currentMatch.matchID; i++) {}
    if (tournamentObj.bracket[i]?.matchID === currentMatch.matchID) {
        tournamentObj.bracket[i] = currentMatch;
    }

    // WAS IT THE FINAL?
    const nextMatch = getNextMatchInBracket(tournamentObj);
    if (nextMatch === undefined) { // Means currentMatch was the tournament final
        // handle end of tournament
    }

    // IF TOURNAMENT GOES ON
    // assign winnerID to player1 of next match
    const nextPlayerID = currentMatch.winnerID;
    if (nextMatch?.users === undefined) {
// player1
    } else {
// player2
    }
    // send full matchObj to DB

    // waiting screen for winner
    // back to menu for loser

    // when first round done
    // start next round

    // when tournament over
    // send last matchObj to DB
    // or send full tournamentObj?
    ;
}

function getNextMatchInBracket(tournament: tournament): match | undefined {
    tournament.bracket.forEach((matchObj) => {
        if (matchObj.users === null || (matchObj.users && matchObj.users[1] === null)) {
            return matchObj;
        }
    }
    );
    return undefined;
}