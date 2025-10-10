import type { Game } from '../classes/game.class.js';
import type { Player } from '../classes/player.class.js';
import { validMess, type messObj } from './mess.validation.js';
import { gameLoop } from './game.loop.js';

export function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	setMessEvent(player1);
	setMessEvent(player2);
	game.time.lastFrame = Date.now();
	gameLoop(game, player1, player2);
}

function setMessEvent(player: Player) {
	player.socket.on("message", (payload: string) => {
		let mess: messObj; //TODO: rm timestamp
		try { mess = JSON.parse(payload); }
		catch (err) { return; };
		if (!validMess(mess))
			return;
		player.keys = { ...mess._keys};
	})
}
