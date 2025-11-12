import { Game } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import { Player } from "../classes/player.class.js";
import { StringCodec } from 'nats';

const SERVER_TICK: number = 1000 / 40; // 20UPS
const TIME_STEP: number = 1000 / 60; // 60FPS

export async function gameLoop(game: Game, player1: Player, player2: Player) {
	const start = performance.now();
	const tickStart = game.lastTick === 0 ? start : game.lastTick;
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

	// new loop
	const delay: number = SERVER_TICK - (performance.now() - start);
	game.addTimoutID(setTimeout(gameLoop, Math.max(0, delay), game, player1, player2));
}

function moveBall(game: Game, simulatedTime: number, end: number, i: number): number {
	while(simulatedTime + i <= end) {
		if (updateBallPos(game, game.players[0]!, game.players[1]!)) {
			endGame(game.players[0]!, game.players[1]!, game);
			return -1;
		}
		simulatedTime += TIME_STEP;
	}
	return simulatedTime;
}

function endGame(player1: Player, player2: Player, game: Game) {
	sendToPlayers(game, player1, player2);
	game.fillGameInfos();
	const sc = StringCodec();
	game.nc.publish("game.over", sc.encode(JSON.stringify(game.infos)));
	player1.socket.close();
	if (!game.local)
		player2.socket.close();
	//TODO: send result to gameManager via nats
}

function sendToPlayers(game: Game, player1: Player, player2: Player) {
	player1.sendReply(game.ball, player2, game.padSpec.width);
	if (!game.local)
		player2.sendReply(game.ball, player1, game.padSpec.width);
}
