import type { FastifyInstance } from 'fastify';
import type { game, lobbyInfo, userInfo } from '../gameManager/gameManager.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';
import { findLobbyIDFromUserID, lobbyMap } from '../lobby/lobby.gm.js';

export function createGameObj(lobbyInfo: lobbyInfo, lobbyID: string) {
	if (!lobbyInfo) {
		console.log('Error: lobbyInfo is empty!');
		return undefined;
	}

    const usersArray: userInfo[] = Array.from(lobbyMap.get(lobbyID)!.whitelist!.userIDs.values());
	//TODO: fill userList with usernames and use it instead of whiteList to fill usersArray ? this is only for better logic, whiteList has all usernames
	if (lobbyInfo.remote === false)
		usersArray.push({userID: "temporary", username: lobbyInfo.gameSettings!.opponent!})
	const game: game = {
		lobbyID: lobbyInfo.lobbyID!,
		tournamentID: '-1',
		gameID: crypto.randomUUID().toString(),
		remote: lobbyInfo.remote,
		users: usersArray,
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
	natsPublish(serv, 'game.request', JSON.stringify(game), 'game.reply');
}
