import type { Game } from '../classes/game.class.js';
import { updatePaddlePos } from './paddle.js';
import type { Player } from '../classes/player.class.js';

export interface keysObj {
	_w: boolean,
	_s: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
	[key: string]: boolean,
}

export interface messObj {
	_keys: keysObj,
	_timeStamp: number,
}

export function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	if (game.local)
		setMessEvent(player1, player2, local);
	else {
		setMessEvent(player1, player2, remote);
		setMessEvent(player2, player1, remote);
	}
}

function setMessEvent(player: Player, opponent: Player, sendReply: Function) {
	let lastFrameTime: number = 0;
	player.socket.on("message", (payload: any) => {
		const mess: messObj = JSON.parse(payload);
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

function local(player: Player, opponent: Player, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	updatePaddlePos(opponent, keys, delta);
	player.setMess("left", player.paddle.y);
	player.setMess("right", opponent.paddle.y);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
}

function remote(player: Player, opponent: Player, keys: keysObj, delta: number) {
	updatePaddlePos(player, keys, delta);
	player.setMess("left", player.paddle.y);
	opponent.setMess("right", player.paddle.y);
	if (player.socket.readyState === 1)
		player.socket.send(JSON.stringify(player.rep));
	if (opponent.socket.readyState === 1)
		opponent.socket.send(JSON.stringify(opponent.rep));
}
