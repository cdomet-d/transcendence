import type { WebSocket } from '@fastify/websocket';
import { Game, HEIGHT, WIDTH } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { movePaddle, updatePaddlePos } from './paddle.js';
import { Player } from "../classes/player.class.js";
import { messageHandler } from './pong.js';

const SERVER_TICK: number = 1000 / 60;
const TIME_STEP: number = 1000 / 60;

export async function gameLoop(game: Game, player1: Player, player2: Player) { //TODO: make player1 and player2 getters
	game.startLoop = performance.now();
	let tickStart = game.lastTick === 0 ? game.startTimestamp : game.lastTick;
	const tickEnd = tickStart + SERVER_TICK;
	tickStart -= game.remainingTickTime;
	game.lastTick = tickEnd

	// get requests
	const reqsToProcess = game.reqHistory.filter(playerReq => playerReq._req._timeStamp < tickEnd);
	reqsToProcess.sort((a, b) => a._req._timeStamp - b._req._timeStamp);

	// update game
	let simulatedTime = 0;
	for (const playerReq of reqsToProcess) {
		const player: Player = playerReq._id === 1 ? player1 : player2;
		simulatedTime = moveBall(game, simulatedTime, playerReq._req._timeStamp - tickStart);
		if (simulatedTime === -1)
			return;
		updatePaddlePos(player, playerReq._req._keys, game);
		player.reply._ID = playerReq._req._ID;
	}
	simulatedTime = moveBall(game, simulatedTime, SERVER_TICK)
	if (simulatedTime === -1)
		return;
	sendToPlayers(game, player1, player2);
	game.remainingTickTime = SERVER_TICK - simulatedTime;

	// clean
	game.reqHistory = game.reqHistory.filter(playerReq => playerReq._req._timeStamp >= tickEnd - game.remainingTickTime);

	// new loop
	const delay: number = SERVER_TICK - (performance.now() - game.startLoop);
	game.startLoop = 0;
	game.addTimoutID(setTimeout(gameLoop, Math.max(0, delay), game, player1, player2));
}

function moveBall(game: Game, simulatedTime: number, end: number): number {
	while(simulatedTime + TIME_STEP <= end) {
		if (updateBallPos(game, game.players[0]!, game.players[1]!)) {
			endGame(game.players[0]!, game.players[1]!, game);
			return -1;
		}
		finishSteps(game);
		simulatedTime += TIME_STEP;
	}
	return simulatedTime;
}

function finishSteps(game: Game) {
	for (const player of game.players) {
		if (player.padStep.x != 0 || player.padStep.y != 0) {
			movePaddle(game, player.paddle, player.padStep);
			player.setPadStep();
		}
	}
}

export function endGame(player1: Player, player2: Player, game: Game) {
	game.ball.x = WIDTH / 2;
	game.ball.y = HEIGHT / 2;
	game.ball.dx = 0;
	game.ball.dy = 0;
	game.deleteReq();
	sendToPlayers(game, player1, player2);
	if (player1.score === player2.score) {
		evenScore(game, player1, player2);
		return;
	}
	player1.socket.removeListener("message", messageHandler);
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

async function evenScore(game: Game, player1: Player, player2: Player) {
	game.lastBall = true;
	await new Promise(res => game.addTimoutID(setTimeout(res, 1500)));
	game.ball.dx = 0.3 * game.ballDir;
	game.ball.dy = 0.03;
	game.ballDir *= -1;
	game.passStart = performance.now();
	sendToPlayers(game, player1, player2);
	game.addTimoutID(setTimeout(gameLoop, SERVER_TICK, game, player1, player2));
}
