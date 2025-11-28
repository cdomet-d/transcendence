import { fetch, Agent } from 'undici';
import type { game } from '../manager.interface.js';

export function gameOver(payload: string) {
	const game: game = JSON.parse(payload);
	postGameToDashboard(game);
	patchGameToUsers(game);
	// showWinnerScreen();
}

interface gameDashboardReqBody {
	gameID: string //TODO: need to update type in db
	tournamentID?: string | undefined //TODO: does db handle undefined ?
	localGame: boolean
	startTime: number;//DATETIME //(a checker la gueule en typescript)
	player1: number
	player2: number
	duration: number
	player1Score: number
	player2Score: number
}

async function postGameToDashboard(game: game) {
	const url = `http://dashboard:1515/game`;
	const reqBody: gameDashboardReqBody = {
		gameID: game.gameID,
		tournamentID: game.tournamentID,
		startTime: 1, //TODO: add it to gameInfo in pong
		localGame: game.remote ? false : true,
		player1: game.users![0]!.userID!,
		player2: game.users![1]!.userID!,
		duration: game.duration,
		player1Score: game.users![0]!.userID! === game.winnerID ? game.score[0] : game.score[1],
		player2Score: game.users![1]!.userID! === game.winnerID ? game.score[0] : game.score[1],
	}
	try {
		const response: Response = await fetch(url, {
			method: 'POST',
			// headers: {'Content-Type': 'application/json'}, //TODO: why does it create an error 500 ?
			body: JSON.stringify(reqBody),
		});
		// TODO check response status ?
		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			// throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /game) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
}

interface usersReqBody {
	player1: number;
	player2: number;
	player1Score: number;
	player2Score: number;
	longuestPass: number;
	duration: number;
}

async function patchGameToUsers(game: game) {
	const url = `http://users:2626/stats`;
	const reqBody: usersReqBody = {
		player1: game.users![0]!.userID!,
		player2: game.users![1]!.userID!,
		player1Score: game.users![0]!.userID! === game.winnerID ? game.score[0] : game.score[1],
		player2Score: game.users![1]!.userID! === game.winnerID ? game.score[0] : game.score[1],
		longuestPass: game.longuestPass,
		duration: game.duration,
	}
	try {
		const response: Response = await fetch(url, {
			method: 'PATCH',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(reqBody),
		});
		// TODO check response status ?
		if (!response.ok) {
			console.error(`[GM] Users service failed with status: ${response.status}`);
			// throw new Error(`Users service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Users service (via route /game) is unreachable: ${error}`);
		throw new Error('Users service is unreachable.');
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