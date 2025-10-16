import type { Game } from '../classes/game.class.js';
import type { Player, repObj } from '../classes/player.class.js';
import { validRequest, type reqObj } from './mess.validation.js';
import { gameLoop } from './game.loop.js';
import type { WebSocket } from '@fastify/websocket';

interface startObj {
	clientTimeStamp: number,
	serverTimeStamp: number,
	delay: number,
	ballDir: number,
}

export async function setUpGame(game: Game) {
	if (!game.players[0] || !game.players[1])
		return; //TODO: deal with that
	const player1: Player = game.players[0];
	const player2: Player = game.players[1];

	// set players message event
	setMessEvent(player1, 1, game);
	setMessEvent(player2, 2, game);

	// send signal cause we got both players ready
	player1.socket.send("1");
	if (!game.local)
		player2.socket.send("1");

	// get clients timestamps
	const player1Timestamp: number = await waitForMessage(player1.socket);
	let player2Timestamp: number = 0;
	if (!game.local) {
		player2Timestamp = await waitForMessage(player2.socket);
	} //TODO: add try catch ?

	// send back server timestamp and delay
	const start: startObj = { clientTimeStamp: player1Timestamp, serverTimeStamp: Date.now(), delay: 500, ballDir: 1}
	player1.socket.send(JSON.stringify(start));
	if (!game.local) {
		start.ballDir = -1;
		start.clientTimeStamp = player2Timestamp;
		player2.socket.send(JSON.stringify(start));
	}

	// start game
	while (start.delay > 0) {
		start.delay -= (Date.now() - start.serverTimeStamp);
	}
	gameLoop(game, player1, player2);
}

function setMessEvent(player: Player, playerNbr: number, game: Game) {
	player.socket.on("message", (payload: string) => {
		let req: reqObj; //TODO: rm timestamp
		try { req = JSON.parse(payload); }
		catch (err) { return; };
		if (!validRequest(req))
			return;
		game.addReq(req, playerNbr);
		player.keys = { ...req._keys};
	})
}

function waitForMessage(socket: WebSocket): Promise< number > {
	return new Promise((resolve, reject) => {
		socket.addEventListener('message', (event) => {
			try {
				const clientTimestamp: number = Number(event.data);
				if (Number.isNaN(clientTimestamp))
					reject(new Error("Invalid timestamp"));
				resolve(clientTimestamp);
			} catch (err) {
				reject(err);
			}
		}, { once: true });
	});
}