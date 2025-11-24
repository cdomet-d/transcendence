import { StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { natsConnect } from './publisher.js';
import type { gameRequest } from '../manager.interface.js';
import { wsClientsMap } from '../lobby/lobby.js';

interface user {
	userID: number,
	username: string,
}

export async function natsSubscribe() {
	const nc = await natsConnect();

	const pregame = nc.subscribe('game.reply'); // where PONG answers "game.request"
	(async () => {
		for await (const msg of pregame) {
			const sc = StringCodec();
			// const game: {gameID: number, users: user[], remote: boolean} = JSON.parse(sc.decode(msg.data));
			const game: {gameID: string, users: user[], remote: boolean} = JSON.parse(sc.decode(msg.data));
			// console.log(`GM received in "game.reply" : `, payload);

			if (game.users === null || game.users === undefined) return;
			for (let i = 0; i < game.users.length; i++) {
				const userID = game.users[i]!.userID;
				const socket = wsClientsMap.get(userID);

				const gameReq: gameRequest = {
					userID: userID,
					gameID: game.gameID,
					remote: game.remote
				}
				wsSend(socket, JSON.stringify(gameReq));
			}
		}
	})();

	const postgame = nc.subscribe('game.over'); // where PONG sends game that just finished
	(async () => {
		for await (const msg of postgame) {
			const sc = StringCodec();
			const payload = sc.decode(msg.data);
			console.log(`GM received following in "game.over" :\n`, JSON.stringify(payload));

			tournamentState(payload);
		}
	})();
}