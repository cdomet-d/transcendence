import type { Game, stateObj } from "../classes/game.class.js";
import { updateBallPos, touchesPad } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';
import { coordinates, Player } from "../classes/player.class.js";
import { reqObj } from "./mess.validation.js";

const SERVER_TICK: number = 1000 / 20; // 20FPS
const TIME_STEP: number = 1000 / 60; // 60FPS

export function gameLoop(game: Game, player1: Player, player2: Player) {
	const start = performance.now();
	const tickStart = game.time.lastFrame === 0 ? start : game.time.lastFrame;
	const tickEnd = tickStart + SERVER_TICK;
	game.time.lastFrame = tickEnd;

	const toProcess = game.reqHistory.filter(playerReq => playerReq._req._timeStamp < tickEnd);
	const futureReqs = game.reqHistory.filter(playerReq => playerReq._req._timeStamp >= tickEnd);

	toProcess.sort((a, b) => a._req._timeStamp - b._req._timeStamp);

	let simulatedTime = 0;

	for (const req of toProcess) {
		const player: Player = req._playerId === 1 ? player1 : player2;
		rewind(game, player, req._req);
		while(simulatedTime + TIME_STEP <= req._req._timeStamp - tickStart) {
			game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
			if (game.status) {
				endGame(player1, player2, game);
				return;
			}
			simulatedTime += TIME_STEP;
		}
		updatePaddlePos(player, req._req._keys, game.paddleSpeed, TIME_STEP);
		player.reply._ID = req._req._ID;
	}

	while(simulatedTime < SERVER_TICK) {
		game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
		simulatedTime += TIME_STEP;
		if(game.status){
			endGame(player1, player2, game);
			return;
		}
	}

	game.reqHistory = futureReqs;

	const timestamp: number = performance.now();
	game.addState(timestamp);

	sendToPlayer(player1, player2.paddle, game.ball, "left");
	if (!game.local)
		sendToPlayer(player2, player1.paddle, game.ball, "right");

	const delay: number = SERVER_TICK - (performance.now() - start);
	setTimeout(gameLoop, Math.max(0, delay), game, player1, player2);
}

function rewind(game: Game, player: Player, req: reqObj) {
	let state: stateObj | undefined = undefined;
	const timestamp: number = req._timeStamp - 100
	let i: number = 0;
	while( i < game.stateHistory.length - 1) {
		if (timestamp >= game.stateHistory[i]!._timestamp
			&& timestamp <= game.stateHistory[i + 1]!._timestamp) {
				state = game.stateHistory[i];
				break;
			}
		i++;
	}
	if (state === undefined)
		return;
	const playerPad: coordinates = { ...player.paddle };
	updatePaddlePos(player, req._keys, game.paddleSpeed, TIME_STEP);
	let newX: number = state._ball.x + (state._ball.dx * TIME_STEP);
	let newY: number = state._ball.y + (state._ball.dy * TIME_STEP);
	if (touchesPad(game.players[0]!.paddle, game.players[1]!.paddle, newX, newY)) {
		game.ball.x = state._ball.x;
		game.ball.y = state._ball.y;
		while (i < game.stateHistory.length) {
			let simulatedTime: number = 0;
			while(simulatedTime + TIME_STEP <= SERVER_TICK) {
				game.status = updateBallPos(game.ball, game.players[0]!, game.players[1]!, TIME_STEP);
				if (game.status) {
					endGame(game.players[0]!, game.players[1]!, game);
					return;
				}
				simulatedTime += TIME_STEP;
			}
			game.updateState(i);
		}
	}
	else {
		player.paddle.x = playerPad.x;
		player.paddle.y = playerPad.y;
	}
}

function sendToPlayer(player: Player, opponentPaddle: coordinates, ball: ballObj, side: string) {
	player.setMessPad("left", player.paddle.y);
	player.setMessPad("right", opponentPaddle.y);
	player.setMessBall(side, ball);
	// player.reply._timestamp = 0;
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