import 'dotenv/config';
import { StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { wsClientsMap } from '../lobby/wsHandler.js';
import { natsConnect } from './publisher.js';
import type { gameRequest } from '../manager.js';

export async function natsSubscribe() {
	const nc = await natsConnect();

	const pregame = nc.subscribe('game.reply'); // where PONG answers "game.request"
	(async () => {
		for await (const msg of pregame) {
			const sc = StringCodec();
			const payload = JSON.parse(sc.decode(msg.data));
			const game = payload.game;
			// console.log(`GM received in "game.reply" : `, payload);

			for (let i = 0; i < game.userList.length; i++) {
				const userID = game.userList[i].userID;
				const socket = wsClientsMap.get(userID);

				const gameRequest: gameRequest = {
					event: payload.event,
					userID: userID,
					gameID: game.gameID
				}

				wsSend(socket, JSON.stringify(gameRequest));
			}
		}
	})();

	const postgame = nc.subscribe('game.over'); // where PONG sends game that just finished
	(async () => {
		for await (const msg of postgame) {
			const sc = StringCodec();
			const payload = sc.decode(msg.data);
			console.log(`GM received following in "game.over" :\n`, payload);

			tournamentState(payload);
		}
	})();
}