import type { FastifyInstance } from 'fastify';
import { createGameObj, startGame } from '../quickmatch/createGame.js';
import { createTournament } from '../tournament/tournamentCreation.js';
import { startTournament } from '../tournament/tournamentStart.js';
import type { game, lobbyInfo, tournament } from './gameManager.interface.js';
import { findLobbyIDFromUserID } from '../lobby/lobby.gm.js';

export function processGameRequest(serv: FastifyInstance, lobbyInfo: lobbyInfo): undefined {
	const lobbyID: string | null = findLobbyIDFromUserID(lobbyInfo.hostID!);
	if (lobbyID === null) {
		console.log("Lobby not found");
		return undefined;
	}

	if (lobbyInfo.format === 'tournament') {
		const tournament: tournament | undefined = createTournament(lobbyInfo, lobbyID);
		if (tournament === undefined) {
			console.log('Error: Could not create tournament');
			return undefined;
		}
		lobbyInfo.joinable = false;
		startTournament(serv, tournament);
	} else if (lobbyInfo.format === 'quickmatch') {
		const quickmatch: game | undefined = createGameObj(lobbyInfo, lobbyID);
		if (quickmatch === undefined) {
			console.log('Error: Something went wrong!');
			return undefined;
		}
		lobbyInfo.joinable = false;
		startGame(serv, quickmatch);
	}
}