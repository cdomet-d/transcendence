import type { FastifyInstance } from 'fastify';
import type { game, lobbyInfo, userInfo } from '../gameManager/gameManager.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';
import { findLobbyIDFromUserID, lobbyMap } from '../lobby/lobby.gm.js';

export function createGameObj(lobbyInfo: lobbyInfo) {
	if (!lobbyInfo) {
		console.log('Error: lobbyInfo is empty!');
		return undefined;
	}

	const lobbyID: string | null = findLobbyIDFromUserID(lobbyInfo.hostID!);
	if (lobbyID === null) {
		console.log("Lobby not found");
		return;
	}
    const usersArray: userInfo[] = Array.from(lobbyMap.get(lobbyID!)!.whitelist!.userIDs.values());//Array.from(lobbyInfo.userList.values());

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
		startTime: '',
		// gameSettings
	};

	return game;
}

export function startGame(serv: FastifyInstance, game: game) {
	natsPublish(serv, 'game.request', JSON.stringify(game), 'game.reply');
}
