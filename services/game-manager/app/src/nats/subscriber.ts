import { StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { natsConnect } from './publisher.js';
import type { game, gameRequest } from '../manager.interface.js';
import { wsClientsMap } from '../lobby/lobby.js';
import { gameOver } from '../quickmatch/gameOver.js';

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
			const game: { gameID: string, users: user[], remote: boolean } = JSON.parse(sc.decode(msg.data));
			// console.log(`GM received in "game.reply" : `, payload);
			console.log("USERS:", game.users);
			if (game.users === null || game.users === undefined) {
				console.log("EMPTY USERS");
				return;
			}
			for (let i = 0; i < game.users.length; i++) {
				const userID = game.users[i]!.userID;
				if (userID === -1) break;
				const socket = wsClientsMap.get(userID);

				const gameReq: gameRequest = {
					username: game.users[i]!.username,
					userID: userID,
					// opponent: game.users // TODO figure out how to send username of opponent to PONG depending on local, index etc. 
					gameID: game.gameID,
					remote: game.remote
					// gameSettings
				}

				console.log("7");

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

			// if (tournamentID ==! -1)
			tournamentState(payload);
			// else {
			gameOver(payload);
			// }
		}
	})();
}

/* SAM */
// interface game {
// 	lobbyID: string,
// 	gameID: string,
// 	tournamentID?: string,
// 	remote: boolean,
// 	userList: userInfo[] | undefined | null,
// 	score: string,
// 	winnerID: number,
// 	loserID: number,
// }

/* CHARLOTTE */
// export interface gameInfo {
//     gameID: number,
//     tournamentID: number,
//     remote: boolean,
//     users: [user, user],
//     score: [number, number],
//     winnerID: number,
//     loserID: number
// }