import type { WebSocket } from '@fastify/websocket';

interface userInfo {
	userID?: string,
	username?: string,
	userSocket?: WebSocket,
}

interface PongOptions {
    background?: string;
    ballspeed: string;
    horizontal?: string;
    paddlesize: string;
    paddlespeed: string;
    opponent?: string;
}

interface lobbyInfo {
	hostID?: string,
	lobbyID?: string,
	whitelist?: whitelist,
	joinable?: boolean,
	userList: Map<string, userInfo>,
	remote: boolean,
	format: 'quickmatch' | 'tournament' | string,
	nbPlayers: number,
	gameSettings?: PongOptions
}

interface whitelist {
	lobbyId: string,
	hostID: string,
	userIDs: Map<string, userInfo>
}

interface game {
	lobbyID: string,
	gameID: string,
	tournamentID?: string,
	remote: boolean,
	users: userInfo[] | undefined | null,
	score: [number, number],
	winnerID: string,
	loserID: string,
	duration: number,
	longuestPass: number,
    startTime: string,
	gameSettings: PongOptions
}

interface tournament {
	tournamentID: string,
	lobbyID: string,
	winnerID: string | undefined | null,
	bracket: game[],
	nbPlayers: number,
	gotBracket: number,
	gotEndGame: number
}

// NATS
interface user {
	userID: string,
	username: string,
}

interface gameReply {
	gameID: string,
	users: [user, user],
	remote: boolean,
	gameSettings: PongOptions,
}

// PONG
interface gameRequest {
	opponent: string,
	gameID: string,
	remote: boolean,
	gameSettings: PongOptions,
}

export type { userInfo, lobbyInfo, whitelist, tournament, game, gameRequest, user, gameReply, PongOptions };
