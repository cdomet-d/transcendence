import { fetch } from 'undici';
import type { game, lobbyInfo, tournament } from '../gameManager/gameManager.interface.js';
import { startGame } from '../quickmatch/createGame.js';
import type { FastifyInstance } from 'fastify';
import { lobbyMap } from '../lobby/lobby.gm.js';
import { wsSend } from '../lobby/wsHandler.gm.js';
import type { WebSocket } from '@fastify/websocket';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';

export const tournamentMap: Map<string, tournament> = new Map();

export function startTournament(serv: FastifyInstance, tournamentObj: tournament, lobbyID: string, socket: WebSocket) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj);
	showBrackets(tournamentObj.bracket, lobbyID, tournamentObj, serv);
	postTournamentToDashboard(tournamentObj);
}

function startFirstRound(serv: FastifyInstance, tournament: tournament) {
	if (tournament.bracket && Array.isArray(tournament.bracket)) {
		startGame(serv, tournament.bracket[0]!);
		startGame(serv, tournament.bracket[1]!);
	}
}

async function postTournamentToDashboard(tournament: tournament) {
	const url = `http://dashboard:1515/tournament`;
	const reqBody: { tournamentID: string, nbPlayers: number } = {
		tournamentID: tournament.tournamentID,
		nbPlayers: tournament.nbPlayers,
	};
	try {
		const response: Response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
		});
		// TODO check response status ?	
		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /tournament) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
};

export function showBrackets(games: game[], lobbyID: string, tournamentObj: tournament, serv: FastifyInstance) {
	const brackets: [string, string][] = [
		[games[0]!.users![0]!.username!, games[0]!.users![1]!.username!],
		[games[1]!.users![0]!.username!, games[1]!.users![1]!.username!],
	];
	const lobby: lobbyInfo | undefined = lobbyMap.get(lobbyID);
	if (!lobby) return;
	for (const user of lobby.userList) {
		if (user[1].userSocket)
			waitForBracketDisplay(serv, user[1].userSocket, tournamentObj);
		wsSend(user[1].userSocket, JSON.stringify({ lobby: 'brackets', brackets: brackets}))
	}
}

function waitForBracketDisplay(serv: FastifyInstance, socket: WebSocket, tournamentObj: tournament) {
	socket.on('message', (message: string) => {
	try {
			const data = JSON.parse(message);
			if (!validateData(data, serv, socket)) throw new Error("invalid input");
			if (!validatePayload(data, data.payload, serv, socket)) throw new Error("invalid input");
			if (data.payload.signal === "got bracket") {
				tournamentObj.gotBracket += 1;
				if (tournamentObj.gotBracket === 4) {
					startFirstRound(serv, tournamentObj);
					tournamentObj.gotBracket = 0;
				}
			}
		} catch (err: any) {
			socket.close(1003, err.message);
			serv.log.error(err.message);
		}
	});
}
