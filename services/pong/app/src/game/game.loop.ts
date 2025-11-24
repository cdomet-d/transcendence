import type { WebSocket } from '@fastify/websocket';
import { Game } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { movePaddle, updatePaddlePos } from './paddle.js';
import { Player } from "../classes/player.class.js";
import { messageHandler } from './pong.js';

const SERVER_TICK: number = 1000 / 50;
const TIME_STEP: number = 1000 / 60;

export async function gameLoop(game: Game, player1: Player, player2: Player) {
	const startLoop: number = performance.now();
	const tickStart = game.lastTick === 0 ? game.startTimestamp : game.lastTick;
	const tickEnd = tickStart + SERVER_TICK;
	game.lastTick = tickEnd;

	// get requests
	const reqsToProcess = game.reqHistory.filter(playerReq => playerReq._req._timeStamp < tickEnd);
	const futureReqs = game.reqHistory.filter(playerReq => playerReq._req._timeStamp >= tickEnd);
	reqsToProcess.sort((a, b) => a._req._timeStamp - b._req._timeStamp);

	// update game
	let simulatedTime = 0;
	for (const playerReq of reqsToProcess) {
		const player: Player = playerReq._id === 1 ? player1 : player2;
		simulatedTime = moveBall(game, simulatedTime, playerReq._req._timeStamp - tickStart, TIME_STEP);
		if (simulatedTime === -1)
			return;
		updatePaddlePos(player, playerReq._req._keys, game);
		player.reply._ID = playerReq._req._ID;
	}
	if (moveBall(game, simulatedTime, SERVER_TICK, 0) === -1)
		return;
	sendToPlayers(game, player1, player2);

	// clean
	game.reqHistory = futureReqs;
	player1.padStep.x = 0;
	player1.padStep.y = 0;
	player2.padStep.x = 0;
	player2.padStep.y = 0;

	// new loop
	const delay: number = SERVER_TICK - (performance.now() - startLoop);
	game.addTimoutID(setTimeout(gameLoop, Math.max(0, delay), game, player1, player2));
}

function moveBall(game: Game, simulatedTime: number, end: number, i: number): number {
	while(simulatedTime + i <= end) {
		if (updateBallPos(game, game.players[0]!, game.players[1]!)) {
			endGame(game.players[0]!, game.players[1]!, game);
			return -1;
		}
		if (game.players[0]!.padStep.x != 0 || game.players[0]!.padStep.y != 0)
			movePaddle(game, game.players[0]!.paddle, game.players[0]!.padStep);
		if (game.players[1]!.padStep.x != 0 || game.players[1]!.padStep.y != 0)
			movePaddle(game, game.players[1]!.paddle, game.players[1]!.padStep);
		simulatedTime += TIME_STEP;
	}
	return simulatedTime;
}

export function endGame(player1: Player, player2: Player, game: Game) {
	player1.socket.removeListener("message", messageHandler);
	if (!game.local)
		player2.socket.removeListener("message", messageHandler);
	waitForEnd(player1.socket);
	if (!game.local)
		waitForEnd(player2.socket);
	player1.reply._end = true;
	player2.reply._end = true;
	sendToPlayers(game, player1, player2);
}

function waitForEnd(socket: WebSocket) {
	socket.on('message', (payload: string) => {
		try {
			const signal = JSON.parse(payload);
			if (signal == "0")
				socket.close();
		} catch (err) {
			throw err; //TODO: handle error
		}
	});
}

function sendToPlayers(game: Game, player1: Player, player2: Player) {
	player1.sendReply(game.ball, player2, game.padSpec.w);
	if (!game.local)
		player2.sendReply(game.ball, player1, game.padSpec.w);
}
