import type { Game } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';
import { coordinates, Player } from "../classes/player.class.js";

const SERVER_TICK: number = 1000 / 10; // 10FPS
const TIME_STEP: number = 1000 / 60; // 60FPS

export function gameLoop(game: Game, player1: Player, player2: Player) {
	const start = Date.now();
    const tickStart = game.time.lastFrame === 0 ? start : game.time.lastFrame;
    const tickEnd = tickStart + SERVER_TICK;
    game.time.lastFrame = tickEnd;

    const toProcess = game.reqHistory.filter(playerReq => playerReq._req._timeStamp < tickEnd);
    const futureReqs = game.reqHistory.filter(playerReq => playerReq._req._timeStamp >= tickEnd);

    toProcess.sort((a, b) => a._req._timeStamp - b._req._timeStamp);

	// let elapsed = 0;
    for (const req of toProcess) {
		const player: Player = req._playerId === 1 ? player1 : player2;
		updatePaddlePos(player, req._req._keys, game.paddleSpeed, TIME_STEP);
		game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
		if (game.status) {
			endGame(player1, player2, game);
			return;
		}
		// elapsed += TIME_STEP;
	}
	game.reqHistory = futureReqs;

	sendToPlayer(player1, player2.paddle, game.ball, "left");
	if (!game.local)
		sendToPlayer(player2, player1.paddle, game.ball, "right");

	const delay: number = SERVER_TICK - (Date.now() - start);
	setTimeout(gameLoop, Math.max(0, delay), game, player1, player2);
}

function sendToPlayer(player: Player, opponentPaddle: coordinates, ball: ballObj, side: string) {
	player.setMessPad("left", player.paddle.y);
	player.setMessPad("right", opponentPaddle.y);
	player.setMessBall(side, ball);
	//TODO: add score
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.reply));
}

function endGame(player1: Player, player2: Player, game: Game) {
	sendToPlayer(player1, player2.paddle, game.ball, "left");
	if (!game.local)
		sendToPlayer(player2, player1.paddle, game.ball, "right");
	player1.socket.close();
	if (!game.local)
		player2.socket.close();
	//TODO: send result to gameManager via nats
}