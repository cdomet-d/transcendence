import type { Game } from '../classes/game.class.js';
import type { Player } from '../classes/player.class.js';
import { validRequest } from './mess.validation.js';
import type { reqObj } from '../classes/game.interfaces.js';
import { endGame, gameLoop } from './game.loop.js';
 
const START_DELAY = 500;
const SERVER_TICK: number = 1000 / 50;
const MAX_TIME: number = /*3500;/*/ 90000; // 1min30

export async function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];

	// set players message event
	setMessEvent(player1, 1, game);
	setMessEvent(player2, 2, game);

	player1.socket.send(1);
	if (!game.local)
		player2.socket.send(-1);

	// start game
	await new Promise(res => game.addTimoutID(setTimeout(res, START_DELAY)));
	game.addTimoutID(setTimeout(endGame, MAX_TIME, player1, player2, game));
	game.startTimestamp = performance.now();
	game.passStart = performance.now();
	game.addTimoutID(setTimeout(gameLoop, SERVER_TICK, game, player1, player2));
}

export let messageHandler: (payload: string) => void;

function setMessEvent(player: Player, playerNbr: number, game: Game) {
	messageHandler = (payload: string) => {
		let req: reqObj;
		try { req = JSON.parse(payload); }
		catch (err) { return; };
		if (!validRequest(req))
			return;
		game.addReq(req, playerNbr);
	}
	player.socket.on("message", messageHandler)
}
