import { StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.gm.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { natsConnect } from './publisher.gm.js';
import type { game, gameRequest, PongOptions } from '../manager.interface.js';
import { wsClientsMap } from '../lobby/lobby.gm.js';
import { gameOver } from '../quickmatch/gameOver.js';

interface user {
	userID: number,
	username?: string,
}

interface gameReply {
	gameID: string,
	users: [user, user],
	remote: boolean,
	gameSettings: PongOptions,
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
			sendGameRequest(game.users[0].userID, game.users[1], game);
			sendGameRequest(game.users[1].userID, game.users[0], game);
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

function sendGameRequest(userID: number, opponent: user, game: gameReply) {
	if (userID === -1) return; // TODO -1 will become 'temporary' 

	const socket = wsClientsMap.get(userID);
	let opponentUsername: string | undefined = opponent.username;
	if (opponentUsername === undefined) {
		// TODO get username from userID
		// const opponentUsername = fetch DB ??;
	}
	const gameReq: gameRequest = {
		opponent: opponentUsername!, // TODO send username of opponent to PONG depending on local/remote, user index etc. 
		gameID: game.gameID,
		remote: game.remote,
		gameSettings: game.gameSettings,
	}

	wsSend(socket, JSON.stringify(gameReq));
}