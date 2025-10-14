import type { Game } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';
import { coordinates, Player } from "../classes/player.class.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export function gameLoop(game: Game, player1: Player, player2: Player) {
	game.time.stamp = Date.now();
	game.time.delta += (game.time.stamp - game.time.lastFrame);
	game.time.lastFrame = game.time.stamp;
	while (game.time.delta >= TIME_STEP) { //TODO: add max num of updates
		updatePaddlePos(player1, player1.keys, game.paddleSpeed, TIME_STEP);
		updatePaddlePos(player2, player2.keys, game.paddleSpeed, TIME_STEP);
		game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
		if (game.status) {
			//TODO send pos to player with score
			player1.socket.close();
			if (!game.local)
				player2.socket.close();
			//TODO: send result to gameManager via nats
			return;
		}
		game.time.delta -= TIME_STEP;
	}
	player1.rep.ID = player1.clientReq._ID;
	sendToPlayer1(player1, player2.paddle, game.ball);
	if (!game.local) {
		player2.rep.ID = player2.clientReq._ID;
		sendToPlayer2(player2, player1.paddle, game.ball);
	}
	setTimeout(gameLoop, TIME_STEP, game, player1, player2);
}

function sendToPlayer1(player: Player, opponentPaddle: coordinates, ball: ballObj) {
	setPaddlesMess(player, opponentPaddle);
	player.setMessBall("left", ball);
	if (player.socket.readyState === 1) {
		player.socket.send(JSON.stringify(player.rep));
	}
}

function sendToPlayer2(player: Player, opponentPaddle: coordinates, ball: ballObj) {
	setPaddlesMess(player, opponentPaddle);
	player.setMessBall("right", ball);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
}

function setPaddlesMess(player: Player, opponentPaddle: coordinates) {
	player.setMessPad("left", player.paddle.y);
	player.setMessPad("right", opponentPaddle.y);
}
