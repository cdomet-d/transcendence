import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import type { Game } from '../classes/game-class.js';
import { setUpGame } from './pong.js';
import { validIds } from './mess-validation.js';
import type { idsObj } from '../classes/game-interfaces.js';
import { natsSubscription } from '../nats/subscriber.js';
import { StringCodec } from 'nats';
import { Player } from '../classes/player-class.js';

const MAX_TIME: number = 90000; // 1min30
const MAX_SCORE: number = 5;

export async function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): Promise< void > {
	this.log.info('PONG webSocket connection established');

	const ids: idsObj = await waitForMessage(socket);

	const game: Game | undefined = this.gameRegistry.findGame(ids.gameID);
	if (!game)
		throw new Error("game " + ids.gameID + " not found"); //TODO: check if its properly catched
	if (game.players.length === 2)
		throw new Error("not allowed");

	getPlayerInGame(game, ids.userID, socket);
	
	// socket.onerror = (event) => {}; //TODO

	socket.on('close', () => {
		if (game) {
			game.cleanTimeoutIDs();
			cheater(game, socket);
			if (game.endSent === false) {
				game.fillGameInfos();
				const sc = StringCodec();
				game.nc.publish("game.over", sc.encode(JSON.stringify(game.infos)));
				game.endSent = true;
			}
			game.deletePlayers();
			this.gameRegistry.deleteGame(game.gameID);
			natsSubscription(this); //TODO: only for testing
		}
	});
}

export function waitForMessage(socket: WebSocket): Promise<idsObj> {
	return new Promise((resolve, reject) => {
		socket.once('message', (payload: string) => {
			try {
				const ids = JSON.parse(payload);
				if (!validIds(ids))
					reject(new Error("Invalid ids"));
				resolve(ids);
			} catch (err) {
				reject(err);
			}
		});
	});
}

function getPlayerInGame(game: Game, userID: number, socket: WebSocket) {
	game.addPlayer(userID, socket, "left");
	if (game.local)
		game.addPlayer(game.randUserID, socket, "right");
	if (game.players.length === 2)
		setUpGame(game);
}

function cheater(game: Game, socket: WebSocket) {
	if (!game.players[0] || !game.players[1])
		return;
	if (performance.now() - game.startTimestamp >= MAX_TIME
		|| game.players[0].score >= MAX_SCORE || game.players[1].score >= MAX_SCORE)
		return;
	if (game.local) {
		game.players[0].score = -1;
		game.players[1].score = -1;
		return;
	}
	let cheater: Player;
	let innocent: Player;
	if (game.players[0].socket === socket) {
		cheater = game.players[0];
		innocent = game.players[1];
	}
	else {
		cheater = game.players[1];
		innocent = game.players[0];
	}
	if (cheater.score >= innocent.score)
		cheater.score = -1;
}
