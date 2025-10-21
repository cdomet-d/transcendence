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
		while(simulatedTime + TIME_STEP <= req._req._timeStamp - tickStart) {
			game.addState(tickStart + simulatedTime);
			game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
			if (game.status) {
				endGame(player1, player2, game);
				return;
			}
			simulatedTime += TIME_STEP;
		}
		updatePaddlePos(player, req._req._keys, game.paddleSpeed, TIME_STEP);
		rewind(game, req._req);
		player.reply._ID = req._req._ID;
	}

	while(simulatedTime < SERVER_TICK) {
		game.addState(tickStart + simulatedTime);
		game.status = updateBallPos(game.ball, player1, player2, TIME_STEP);
		if(game.status){
			endGame(player1, player2, game);
			return;
		}
		simulatedTime += TIME_STEP;
	}

	game.deleteStates(tickStart - 1000);

	game.reqHistory = futureReqs;

	sendToPlayer(player1, player2.paddle, game.ball, "left");
	if (!game.local)
		sendToPlayer(player2, player1.paddle, game.ball, "right");

	const delay: number = SERVER_TICK - (performance.now() - start);
	setTimeout(gameLoop, Math.max(0, delay), game, player1, player2);
}

function rewind(game: Game, req: reqObj) {
	let state: stateObj | undefined = undefined;
	const timestamp: number = req._timeStamp;
	let i: number = 0;
	while( i < game.stateHistory.length - 1) {
		if (timestamp >= game.stateHistory[i]!._timestamp
			&& timestamp <= game.stateHistory[i + 1]!._timestamp) {
				if (Math.abs(timestamp - game.stateHistory[i]!._timestamp) < Math.abs(timestamp - game.stateHistory[i + 1]!._timestamp))
					state = game.stateHistory[i];
				else
					state = game.stateHistory[i + 1];
				break;
			}
		i++;
	}
	if (state === undefined)
		return;
	
	const age: number = performance.now() - state._timestamp;
	if (age > 200 || age < 0)
		return;
	
	console.log("IN REWIND");
	if (touchesPad(game.players[0]!.paddle, game.players[1]!.paddle, state._ball.x, state._ball.y)) { //devrait verifier que le paddle qui a changé de position
		game.ball.dx *= -1;
		game.ball.x += (game.ball.dx * TIME_STEP);
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