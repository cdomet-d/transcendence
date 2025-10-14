import type { Game } from '../classes/game.class.js';
import type { Player } from '../classes/player.class.js';
import { validMess, type reqObj } from './mess.validation.js';
import { gameLoop } from './game.loop.js';
import type { WebSocket } from '@fastify/websocket';

export async function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];
	setMessEvent(player1);
	setMessEvent(player2);
	player1.socket.send(1);
	if (!game.local)
		player2.socket.send(-1);
	game.time.lastFrame = Date.now();
	const signal1: boolean = await waitForMessage(player1.socket);
	let signal2: boolean;
	if (!game.local)
		signal2 = await waitForMessage(player2.socket);	
	else
		signal2 = signal1;
	if (signal1 && signal2)
		gameLoop(game, player1, player2);
}

function setMessEvent(player: Player) {
	player.socket.on("message", (payload: string) => {
		// let mess: messObj; //TODO: rm timestamp
		try { player.clientReq = JSON.parse(payload); }
		catch (err) { return; };
		if (!validMess(player.clientReq))
			return;
		player.keys = { ...player.clientReq._keys};
	})
}

function waitForMessage(socket: WebSocket): Promise< boolean > {
	return new Promise((resolve, reject) => {
		socket.addEventListener('message', (event) => {
			try {
				const signal: number = Number(event.data);
				console.log(signal, typeof(signal));
				if (signal !== 1)
					reject(new Error("Invalid signal"));
				resolve(true);
			} catch (err) {
				reject(err);
			}
		}, { once: true });
	});
}