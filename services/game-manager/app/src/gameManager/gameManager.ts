import type { FastifyInstance } from 'fastify';
import { createGameObj, startGame } from '../quickmatch/createGame.js';
import { createTournament } from '../tournament/tournamentCreation.js';
import { startTournament } from '../tournament/tournamentStart.js';
import type { game, lobbyInfo, tournament } from './gameManager.interface.js';
import { findLobbyIDFromUserID } from '../lobby/lobby.gm.js';

export function processGameRequest(serv: FastifyInstance, lobbyInfo: lobbyInfo): boolean {
	const lobbyID: string | null = findLobbyIDFromUserID(lobbyInfo.hostID!);
	if (lobbyID === null) {
		console.log("Error: Lobby not found in processGameRequest");
		return false;
	}
	
	if (lobbyInfo.format === 'tournament') {
		const tournament: tournament | undefined = createTournament(lobbyInfo, lobbyID);
		if (tournament === undefined) {
			console.log('Error: Could not create tournament');
			return false;
		}
		lobbyInfo.joinable = false;
		startTournament(serv, tournament);
	} else if (lobbyInfo.format === 'quickmatch') {

		const quickmatch: game | undefined = createGameObj(lobbyInfo, lobbyID);
		if (quickmatch === undefined) {
			console.log('Error: Could not create game!');
			return false;
		}
		lobbyInfo.joinable = false;
		startGame(serv, quickmatch);
	}
	return true;
}