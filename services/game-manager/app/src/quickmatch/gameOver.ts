import type { game } from '../manager.interface.js';

export function gameOver(payload: string) {
    // send obj to DB
    // const game: game = JSON.parse(payload);
    // postGameToDashboard(game);
    // showWinnerScreen();
}

// const sslAgent = new Agent({
//     connect: { rejectUnauthorized: false }
// });

// FIXED IN CHARLOTTE'S BRANCH, WAIT FOR NEXT PR
async function postGameToDashboard(game: game) {
    const url = `https://dashboard:1515/game}`;
    let response: Response;

    try {
        response = await fetch(url, {
            method: 'POST',
            // dispatcher: sslAgent,
            body: JSON.stringify(game),
        });
    } catch (error) {
        console.error(`[GM] Dashboard service (via route /game) is unreachable: ${error}`);
        throw new Error('Dashboard service is unreachable.');
    }

    // TODO check response status ?

    if (!response.ok) {
        console.error(`[GM] Dashboard service failed with status: ${response.status}`);
        throw new Error(`Dashboard service failed with status ${response.status}`);
    }
}

/* SAM */
// interface game {
// 	lobbyID: string,
// 	gameID: string,
// 	tournamentID?: string,
// 	remote: boolean,
// 	userList: userInfo[] | undefined | null,
// 	score: string,
// 	winnerID: number,
// 	loserID: number,
// }

/* CHARLOTTE */
// export interface gameInfo {
//     gameID: number,
//     tournamentID: number,
//     remote: boolean,
//     users: [user, user],
//     score: [number, number],
//     winnerID: number,
//     loserID: number
// }

/* ALEX */
// export interface Match {
// 	gameID: number;
// 	duration: number;
// 	startTime: string;
// 	player1: number;
// 	player2: number;
// 	player1Score: number;
// 	player2Score: number;
// }