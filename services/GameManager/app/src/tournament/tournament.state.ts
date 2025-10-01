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

export function startTournament(tournamentObj: tournament) {
    // need async?
    // send match to PONG
    // await approval
    // signal clients

    // Routine
    // start first round of matches

    // when a match finishes
        // update current matchObj winnerID and loserID
        // assign winnerID to player1 of next match
        // send full matchObj to DB
    
        // waiting screen for winner
        // back to menu for loser
    
    // when first round done
        // start next round

    // when tournament over
        // send last matchObj to DB
        // or send full tournamentObj?

    // Tournament over procedure

    // natsPublish("game.request", sc.encode(JSON.stringify(matchObj)), "game.ready");
    ;
}