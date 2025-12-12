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

export async function showWinnerScreen(game: game, serv: FastifyInstance, endLobby: boolean, tournamentObj: tournament | null, nextGame: game | undefined) {
	const lobby: lobbyInfo | undefined = lobbyMap.get(game.lobbyID);
	if (lobby === undefined) {
		serv.log.error("LOBBY UNDEFINED");
		return;
	}
	const player1: userInfo | undefined = lobby.userList.get(game.users![0]!.userID!);
	const player2: userInfo | undefined = lobby.userList.get(game.users![1]!.userID!);
	if (endLobby === true) {
		for (const user of lobby.userList) {
			if (user[1].userSocket)
				waitForLobbyEnd(serv, user[1].userSocket!);
		}
	}
	else if (tournamentObj && endLobby === false) {
		if (player1 && player1.userSocket)
			waitForResultDisplay(serv, player1.userSocket!, tournamentObj, lobby, nextGame);
		if (player2 && player2.userSocket)
			waitForResultDisplay(serv, player2.userSocket!, tournamentObj, lobby, nextGame);
	}
	sendEndGame(player1, player2, game, endLobby, tournamentObj, lobby);
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

function sendEndGame(player1: userInfo | undefined, player2: userInfo | undefined, game: game, endLobby: boolean, tournamentObj: tournament | null, lobby: lobbyInfo) {
	wsSend(player1?.userSocket, JSON.stringify({ event: "END GAME", result: player1?.userID === game.winnerID ? "winner" : "looser", username: player1?.username, endLobby: endLobby}));
	if (game.remote === true)
		wsSend(player2?.userSocket, JSON.stringify({ event: "END GAME", result: player2?.userID === game.winnerID ? "winner" : "looser", username: player2?.username, endLobby: endLobby }));
	if (tournamentObj && endLobby === true) {
		for (const user of lobby.userList) {
			if (user[1].userID !== game.users[0]?.userID && user[1].userID !== game.users[1]?.userID)
				wsSend(user[1].userSocket, JSON.stringify({ event: "END GAME", result: "winner", username: player1?.userID === game.winnerID ? player1.username! : player2?.username!, endLobby: endLobby }));
		}
	}
}