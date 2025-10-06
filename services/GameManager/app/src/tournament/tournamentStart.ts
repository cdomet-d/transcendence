import { natsPublish } from "../nats/publisher.js";

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
export let tournamentMap: Map<number, tournament> = new Map();

export function startTournament(tournamentObj: tournament) {
    tournamentMap.set(tournamentObj.tournamentID, tournamentObj)
    startFirstRound(tournamentObj);
}

// Can I use this loop for later tournament stages?
    // or just loop (players / 2) times for first round
    // and start matches 1 by 1 after in tournamentRoutine
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