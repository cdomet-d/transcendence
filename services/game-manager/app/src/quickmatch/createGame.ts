import type { FastifyInstance } from 'fastify';
import type { game, lobbyInfo, user, userInfo } from '../gameManager/gameManager.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';
import { lobbyMap } from '../lobby/lobby.gm.js';

export function createGameObj(lobbyInfo: lobbyInfo, lobbyID: string): game | undefined {
	if (!lobbyInfo) {
		console.log('Error: lobbyInfo is empty!');
		return undefined;
	}

	const usersArray: userInfo[] = Array.from(lobbyMap.get(lobbyID)!.userList.values());
	const users: user[] = [
		{userID: usersArray[0]!.userID!, username: usersArray[0]!.username! }
	];

	if (usersArray.length !== lobbyInfo.nbPlayers && lobbyInfo.remote === true) {
		return undefined;
	}

	if (lobbyInfo.remote === false)	{
		users[1] = { userID: "temporary", username: lobbyInfo.gameSettings!.opponent! };
	} else {
		users[1] = { userID: usersArray[1]!.userID!, username: usersArray[1]!.username!};
	}


	const game: game = {
		lobbyID: lobbyID,
		tournamentID: '-1',
		gameID: crypto.randomUUID().toString(),
		remote: lobbyInfo.remote,
		users: users,
		score: [0, 0],
		winnerID: '',
		loserID: '',
		duration: 0,
		longuestPass: 0,
		startTime: "",
		gameSettings: lobbyInfo.gameSettings!,
	};

	return game;
}

export function startGame(serv: FastifyInstance, game: game) {
	serv.log.error("IN START GAME");
	natsPublish(serv, 'game.request', JSON.stringify(game), 'game.reply');
}
