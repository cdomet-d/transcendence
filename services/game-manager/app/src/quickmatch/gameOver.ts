import type { FastifyInstance } from 'fastify';
import type { game, lobbyInfo, tournament, userInfo } from '../gameManager/gameManager.interface.js';
import { lobbyMap } from '../lobby/lobby.gm.js';
import { wsSend } from '../lobby/wsHandler.gm.js';
import type { WebSocket } from '@fastify/websocket';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';
import { showBrackets, stopHandler } from '../tournament/tournamentStart.js';

export function gameOver(game: game, serv: FastifyInstance, endLobby: boolean, tournamentObj: tournament | null, nextGame: game | undefined) {
	showWinnerScreen(game, serv, endLobby, tournamentObj, nextGame);
	postGameToDashboard(game);
	patchGameToUsers(game);
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

export async function showWinnerScreen(game: game, serv: FastifyInstance, endLobby: boolean, tournamentObj: tournament | null, nextGame: game | undefined) {
	serv.log.error("IN WINNER SCREEN")
	const lobby: lobbyInfo | undefined = lobbyMap.get(game.lobbyID);
	if (lobby === undefined) {
		serv.log.error("LOBBY UNDEFINED");
		return;
	}
	const user1: userInfo = lobby.userList.get(game.users![0]!.userID!)!;
	const user2: userInfo = lobby.userList.get(game.users![1]!.userID!)!;
	if (endLobby === true) {
		if (user1.userSocket)
			waitForLobbyEnd(serv, user1.userSocket!);
		if (game.remote === true && user2.userSocket)
			waitForLobbyEnd(serv, user2.userSocket!);
	}
	else if (tournamentObj && endLobby === false) {
		if (user1.userSocket)
			waitForResultDisplay(serv, user1.userSocket!, tournamentObj, lobby, nextGame);
		if (user2.userSocket)
			waitForResultDisplay(serv, user2.userSocket!, tournamentObj, lobby, nextGame);
	}
	wsSend(user1.userSocket!, JSON.stringify({ event: "END GAME", result: user1.userID! === game.winnerID ? "winner" : "looser", endLobby: endLobby}));
	if (game.remote === true)
		wsSend(user2.userSocket!, JSON.stringify({ event: "END GAME", result: user2.userID! === game.winnerID ? "winner" : "looser", endLobby: endLobby }));
};

export let lobbyEndHandler: (message: string) => void;
export function waitForLobbyEnd(serv: FastifyInstance, socket: WebSocket) {
	lobbyEndHandler = (message: string) => {
		try {
			const data = JSON.parse(message);
			serv.log.error(`DATA IN WAITFORLOBBYEND: ${JSON.stringify(data)}`)
			if (!validateData(data, serv, socket)) throw new Error("invalid input");
			if (!validatePayload(data, data.payload, serv, socket)) throw new Error("invalid input");
			if (data.payload.signal === "got result") {
				socket.close(4002);
			}
		} catch (err: any) {
			socket.close(1003, err.message);
			serv.log.error(err.message);
		}
	}
	socket.on('message', lobbyEndHandler);
}

export let resultDisplayHandler: (message: string) => void;
function waitForResultDisplay(serv: FastifyInstance, socket: WebSocket, tournamentObj: tournament, lobby: lobbyInfo, nextGame: game | undefined) {
	resultDisplayHandler = (message: string) => {
		try {
			const data = JSON.parse(message);
			if (data.event !== "NOTIF")
				serv.log.error(`DATA IN WAIT FOR RESULT DISPLAY: ${JSON.stringify(data)}`)
			if (!validateData(data, serv, socket)) throw new Error("invalid input");
			if (!validatePayload(data, data.payload, serv, socket)) throw new Error("invalid input");
			if (data.payload.signal === "got result") {
				tournamentObj.gotEndGame += 1;
				if (tournamentObj.gotEndGame === lobby.userList.size)
					showBrackets(tournamentObj.bracket, lobby.lobbyID!, tournamentObj, serv, nextGame);
				stopHandler(resultDisplayHandler, socket);
			}
		} catch (err: any) {
			socket.close(1003, err.message);
			serv.log.error(err.message);
		}
	};
	socket.on('message', resultDisplayHandler);
}
