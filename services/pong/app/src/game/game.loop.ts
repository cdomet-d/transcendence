import { Game, playerReq, snapshotObj } from "../classes/game.class.js";
import { updateBallPos, touchesLeftPad, touchesRightPad } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';
import { coordinates, Player } from "../classes/player.class.js";

const SERVER_TICK: number = 1000 / 20; // 20FPS
const TIME_STEP: number = 1000 / 60; // 60FPS

export function gameLoop(game: Game, player1: Player, player2: Player) {
	const start = performance.now();
	const tickStart = game.time.lastFrame === 0 ? start : game.time.lastFrame;
	const tickEnd = tickStart + SERVER_TICK;
	game.time.lastFrame = tickEnd;

	// get requests
	const reqsToProcess = game.reqHistory.filter(playerReq => playerReq._req._timeStamp < tickEnd);
	const futureReqs = game.reqHistory.filter(playerReq => playerReq._req._timeStamp >= tickEnd);
	reqsToProcess.sort((a, b) => a._req._timeStamp - b._req._timeStamp);

	// update game
	let simulatedTime = 0;
	for (const playerReq of reqsToProcess) {
		const player: Player = playerReq._id === 1 ? player1 : player2;
		simulatedTime = moveBall(game, tickStart, simulatedTime, playerReq._req._timeStamp - tickStart);
		if (simulatedTime === -1)
			return;
		updatePaddlePos(player, playerReq._req._keys, game.paddleSpeed);
		rewind(game, playerReq, player.paddle);
		//TODO: should endGame be called after rewind ?
		player.reply._ID = playerReq._req._ID;
	}
	moveBall(game, tickStart, simulatedTime, SERVER_TICK);
	sendToPlayers(game, player1, player2);

	// clean
	game.reqHistory = futureReqs;
	game.deleteSnapshots(tickStart - 1000);

	// new loop
	const delay: number = SERVER_TICK - (performance.now() - start);
	setTimeout(gameLoop, Math.max(0, delay), game, player1, player2);
}

function moveBall(game: Game, tickStart: number, simulatedTime: number, end: number): number {
	while(simulatedTime + TIME_STEP <= end) {
		game.addSnapshot(tickStart + simulatedTime);
		game.status = updateBallPos(game.ball, game.players[0]!, game.players[1]!);
		if (game.status) {
			endGame(game.players[0]!, game.players[1]!, game);
			return -1;
		}
		simulatedTime += TIME_STEP;
	}
	return simulatedTime
}

function rewind(game: Game, playerReq: playerReq, paddle: coordinates) {
	let snapshot: snapshotObj | undefined = game.findSnapshot(playerReq._req);
	if (snapshot === undefined)
		return;

	const age: number = performance.now() - snapshot._timestamp;
	if (age > 200 || age < 0) //TODO: put 200 in a var
		return;

	console.log("IN REWIND");

	const ball: ballObj = snapshot._ball;
	const x: number = playerReq._id === 1 ? 21 : -11;
	const collision: Function = playerReq._id === 1 ? touchesLeftPad : touchesRightPad;
	if (collision(paddle, ball.x, ball.y)) {
		game.ball.dx *= -1;
		game.ball.x = paddle.x + x; //need to handler y
		return;
	}
}

function sendToPlayers(game: Game, player1: Player, player2: Player) {
	player1.setMessPad(player1.paddle.y, player2.paddle.y);
	player1.setMessBall("left", game.ball);
	//TODO: add score
	if (player1.socket.readyState === 1)
		player1.socket.send(JSON.stringify(player1.reply));
	if (!game.local) {
		player2.setMessPad(player2.paddle.y, player1.paddle.y);
		player2.setMessBall("right", game.ball);
		//TODO: add score
		if (player2.socket.readyState === 1)
			player2.socket.send(JSON.stringify(player2.reply));
	}
}

function endGame(player1: Player, player2: Player, game: Game) {
	sendToPlayers(game, player1, player2);
	player1.socket.close();
	if (!game.local)
		player2.socket.close();
	//TODO: send result to gameManager via nats
}
