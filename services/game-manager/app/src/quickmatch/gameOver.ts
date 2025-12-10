import type { game } from '../gameManager/gameManager.interface.js';

export function gameOver(payload: game) {
	const game: game = payload;
	postGameToDashboard(game);
	patchGameToUsers(game);
	// showWinnerScreen();
	// TODO redirect players to HOME page
}

interface gameDashboardReqBody {
	gameID: string;
	tournamentID?: string | undefined;
	localGame: boolean;
	startTime: string;
	player1: string;
	player2: string;
	duration: number;
	player1Score: number;
	player2Score: number;
}

async function postGameToDashboard(game: game) {
	if (game.score[0] === -1 && game.score[1] === -1)
		return;
	const url = `http://dashboard:1515/game`;
	const reqBody: gameDashboardReqBody = {
		gameID: game.gameID,
		tournamentID: game.tournamentID,
		startTime: game.startTime,
		localGame: game.remote ? false : true,
		player1: game.users![0]!.userID!,
		player2: game.users![1]!.userID!,
		duration: game.duration,
		player1Score: game.users![0]!.userID! === game.winnerID ? game.score[0] : game.score[1],
		player2Score: game.users![1]!.userID! === game.winnerID ? game.score[0] : game.score[1],
	}
	console.log("START TIME", JSON.stringify(reqBody.startTime));
	try {
		const response: Response = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(reqBody),
		});
		// TODO check response status ?
		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /game) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
}

interface usersReqBody {
	player1: string;
	player2: string;
	player1Score: number;
	player2Score: number;
	longuestPass: number;
	duration: number;
}

async function patchGameToUsers(game: game) {
	if (game.score[0] === -1 && game.score[1] === -1)
		return;
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
