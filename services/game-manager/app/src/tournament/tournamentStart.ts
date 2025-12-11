import { fetch } from 'undici';
import type { game, lobbyInfo, tournament, userInfo } from '../gameManager/gameManager.interface.js';
import { startGame } from '../quickmatch/createGame.js';
import type { FastifyInstance } from 'fastify';
import { lobbyMap } from '../lobby/lobby.gm.js';
import { wsSend } from '../lobby/wsHandler.gm.js';
import type { WebSocket } from '@fastify/websocket';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';

export const tournamentMap: Map<string, tournament> = new Map();

export function startTournament(serv: FastifyInstance, tournamentObj: tournament, lobbyID: string) {
	tournamentMap.set(tournamentObj.tournamentID, tournamentObj);
	showBrackets(tournamentObj.bracket, lobbyID, tournamentObj, serv, undefined);
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

export function showBrackets(games: game[], lobbyID: string, tournamentObj: tournament, serv: FastifyInstance, nextGame: game | undefined) {
	// const brackets: [string, string][] = [];
	// for (const game of games) {
	// 	brackets.push([game.users![0]!.username!, games[0]!.users![1]!.username!])
	// }
	const brackets: [string, string][] = [
		[games[0]!.users![0]!.username!, games[0]!.users![1]!.username!],
		[games[1]!.users![0]!.username!, games[1]!.users![1]!.username!],
	];
	const lobby: lobbyInfo | undefined = lobbyMap.get(lobbyID);
	if (!lobby) return;
	for (const user of lobby.userList) {
		if (user[1].userSocket)
			waitForBracketDisplay(serv, user[1].userSocket, tournamentObj, lobby, nextGame);
		wsSend(user[1].userSocket, JSON.stringify({ lobby: 'brackets', brackets: brackets}))
	}
}

export let bracketDisplayHandler: (message: string) => void;
function waitForBracketDisplay(serv: FastifyInstance, socket: WebSocket, tournamentObj: tournament, lobby: lobbyInfo, nextGame: game | undefined) {
	bracketDisplayHandler = (message: string) => {
	try {
			const data = JSON.parse(message);
			if (data.event !== "NOTIF")
				serv.log.error(`DATA IN WAIT FOR BRACKET DISPLAY: ${JSON.stringify(data)}`)
			if (!validateData(data, serv, socket)) throw new Error("invalid input");
			if (!validatePayload(data, data.payload, serv, socket)) throw new Error("invalid input");
			if (data.payload.signal === "got bracket") {
				tournamentObj.gotBracket += 1;
				if (tournamentObj.gotBracket === lobby.userList.size) {
					serv.log.error(`
						NEXT GAME: ${JSON.stringify(nextGame)}
						USER LIST SIZE: ${JSON.stringify(lobby.userList.size)}
						GOT END GAME: ${tournamentObj.gotEndGame}
						NEXT GAME USERS LENGTH: ${nextGame?.users?.length}
					`);
					if (tournamentObj.gotEndGame === 0)
						startFirstRound(serv, tournamentObj);
					else if (tournamentObj.gotEndGame >= lobby.userList.size && nextGame && nextGame.users?.length === 2) {
						serv.log.error(`IN START GAME`);
						startGame(serv, nextGame);
						tournamentObj.gotEndGame = -1;
					}
					tournamentObj.gotBracket = 0;
					stopHandler(bracketDisplayHandler, socket);
				}
			}
		} catch (err: any) {
			socket.close(1003, err.message);
			serv.log.error(err.message);
		}
	}
	socket.on('message', bracketDisplayHandler);
}

export function stopHandler(handler: (message: string) => void, socket: WebSocket) {//lobbyUserList: Map<string, userInfo>) {
	socket.removeEventListener('message', handler);
}
