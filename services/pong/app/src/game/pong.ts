import type { WebSocket } from '@fastify/websocket';
import type { Game } from '../classes/game.class.js';
import type { Player } from '../classes/player.class.js';
import { validMess, type messObj, type keysObj } from './mess.validation.js';
import { gameLoop } from './game.loop.js';

export function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that

	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	
	if (game.local) {
		setMessEvent(player1);
		gameLoop(game);
		player1.socket.send(1);
	}
	else {
		setMessEvent(player1);
		setMessEvent(player2);
		gameLoop(game);
		player2.socket.send(1);
		player1.socket.send(1);
	}
}

function setMessEvent(player: Player) {
	player.socket.on("message", (payload: string) => {
		let mess: messObj; //TODO: rm timestamp
		try { mess = JSON.parse(payload); }
		catch (err) { return; };
		if (!validMess(mess))
			return;
		player.keys = mess._keys;
	})
}

