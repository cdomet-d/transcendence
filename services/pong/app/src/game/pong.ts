import type { Game } from '../classes/game.class.js';
import { updatePaddlePos } from './paddle.js';
import type { Player } from '../classes/player.class.js';
import { validMess, type messObj, type keysObj } from './mess.validation.js';

export function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	
	if (game.local) {
		setMessEvent(player1, player2, local);
		player1.socket.send(1);
	}
	else {
		setMessEvent(player1, player2, remote);
		setMessEvent(player2, player1, remote);
		player1.socket.send(1);
		player2.socket.send(1);
	}
}

export function setMessEvent(player: Player, opponent: Player, sendReply: Function) {
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
		if (!keysDown(keys))
			return;
		sendReply(player, opponent, keys, delta);
	})
}

function keysDown(keys: keysObj): boolean {
	for (const key in keys) {
		if (keys[key])
			return true;
	}
	return false
}

export function local(player: Player, opponent: Player, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	updatePaddlePos(opponent, keys, delta);
	player.setMess("left", player.paddle.y);
	player.setMess("right", opponent.paddle.y);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
	//TODO: handle case where socket isn't open
}

export function remote(player: Player, opponent: Player, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	player.setMess("left", player.paddle.y);
	opponent.setMess("right", player.paddle.y);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
	if (opponent.socket.readyState === 1)
		opponent.socket.send(JSON.stringify(opponent.rep));
}
