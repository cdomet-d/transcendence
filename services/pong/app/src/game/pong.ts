import type { Game } from '../classes/game.class.js';
import { updatePaddlePos } from './paddle.js';
import type { Player } from '../classes/player.class.js';
import { validMess, type messObj, type keysObj } from './mess.validation.js';
import { updateBallPos } from './ball.js';
import type { ballObj } from '../classes/game.class.js';

export function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that

	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	
	player1.ballMaster = true;
	if (game.local) {
		setMessEvent(player1, player2, game.ball, local);
		player1.socket.send(1);
	}
	else {
		setMessEvent(player1, player2, game.ball, remote);
		setMessEvent(player2, player1, game.ball, remote);
		player2.socket.send(1);
		player1.socket.send(1);
	}
}

function setMessEvent(player: Player, opponent: Player, ball: ballObj, sendReply: Function) {
	let lastFrameTime: number = 0;
	player.socket.on("message", (payload: string) => {
		let mess: messObj;
		try { mess = JSON.parse(payload); }
		catch (err) { return; };
		if (!validMess(mess))
			return;
		const keys: keysObj = mess._keys;
		const delta: number = mess._timeStamp - lastFrameTime;
		lastFrameTime = mess._timeStamp;
		sendReply(player, opponent, ball, keys, delta);
	})
}

// function keysDown(keys: keysObj): boolean {
// 	for (const key in keys) {
// 		if (keys[key])
// 			return true;
// 	}
// 	return false
// }

function local(player: Player, opponent: Player, ball: ballObj, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	updatePaddlePos(opponent, keys, delta);
	if (updateBallPos(ball, player, opponent, delta)) {
		player.socket.send(0);
		player.socket.close();
		return;
	}
	player.setMessPad("left", player.paddle.y);
	player.setMessPad("right", opponent.paddle.y);
	player.setMessBall("left", ball);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
	//TODO: handle case where socket isn't open
}

function remote(player: Player, opponent: Player, ball: ballObj, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	player.setMessPad("left", player.paddle.y);
	opponent.setMessPad("right", player.paddle.y);

	if (player.ballMaster) { //TODO: change ballMaster if player gets disconnected
		if (updateBallPos(ball, player, opponent, delta)) {
			player.socket.send(0);
			opponent.socket.send(0);
			return;
		}
		player.setMessBall("left", ball);
		opponent.setMessBall("right", ball);
	}

	if (opponent.socket.readyState === 1)
		opponent.socket.send(JSON.stringify(opponent.rep));
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
}
