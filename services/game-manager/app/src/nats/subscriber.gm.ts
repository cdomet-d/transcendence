import { StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.gm.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { natsConnect } from './publisher.gm.js';
import type { game, gameRequest } from '../manager.interface.js';
import { wsClientsMap } from '../lobby/lobby.gm.js';
import { gameOver } from '../quickmatch/gameOver.js';

interface user {
	userID: number,
	username: string,
}

interface gameReply {
	gameID: string,
	users: user[],
	remote: boolean
}

export async function natsSubscribe() {
	const nc = await natsConnect();

	const pregame = nc.subscribe('game.reply'); // where PONG answers "game.request"
	(async () => {
		for await (const msg of pregame) {
			const sc = StringCodec();
			const game: gameReply = JSON.parse(sc.decode(msg.data));
			// console.log(`GM received in "game.reply" : `, payload);
			console.log("USERS:", game.users);
			if (game.users === null || game.users === undefined) {
				console.log("EMPTY USERS");
				return;
			}
			sendGameRequest(game.users[0]!.userID, game.users[1]!.userID, game, game.users[1]!.username);
			sendGameRequest(game.users[1]!.userID, game.users[0]!.userID, game, game.users[0]!.username);
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

function sendGameRequest(userID: number, opponentID: number, game: gameReply, opponentUsername?: string) {
	if (userID === -1) return; // TODO -1 will become 'temporary' 

	const socket = wsClientsMap.get(userID);

	if (opponentUsername === undefined) {
		// TODO get username from userID
		// const opponentUsername = fetch DB ??;
	}
	const gameReq: gameRequest = {
		opponent: opponentUsername!, // TODO send username of opponent to PONG depending on local/remote, user index etc. 
		gameID: game.gameID,
		remote: game.remote
		// gameSettings
	}

	wsSend(socket, JSON.stringify(gameReq));
}