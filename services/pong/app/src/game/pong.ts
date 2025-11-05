import type { Game } from '../classes/game.class.js';
import type { Player } from '../classes/player.class.js';
import { validRequest, type reqObj } from './mess.validation.js';
import { gameLoop } from './game.loop.js';
import { syncClocks } from './syncClocks.js';
 
const START_DELAY = 500;
const SERVER_TICK: number = 1000 / 40; // 20UPS

export async function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];

	// set players message event
	setMessEvent(player1, 1, game);
	setMessEvent(player2, 2, game);

	// sync client & server clocks
	// try {
	// 	await syncClocks(game, player1, 1);
	// 	if (!game.local)
	// 		await syncClocks(game, player2, 2);
	// } catch (err) {
	// 	return; //TODO: handle error
	// }

	player1.socket.send(1);
	if (!game.local)
		player2.socket.send(-1);

	// start game
	await new Promise(res => game.addTimoutID(setTimeout(res, START_DELAY)));
	game.addTimoutID(setTimeout(gameLoop, SERVER_TICK, game, player1, player2));
}

function setMessEvent(player: Player, playerNbr: number, game: Game) {
	player.socket.on("message", (payload: string) => {
		let req: reqObj; //TODO: rm timestamp
		try { req = JSON.parse(payload); }
		catch (err) { return; };
		// if (!validRequest(req))
		// 	return;
		game.addReq(req, playerNbr);
	})
}
