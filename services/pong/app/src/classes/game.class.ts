import { Player } from './player.class.js';
import type { reqObj } from '../game/mess.validation.js';
import type { WebSocket } from '@fastify/websocket';
import { NatsConnection } from 'nats';

export const HEIGHT = 500;
export const WIDTH = 700;

export interface user {
	userID: number,
	username: string,
	//_score: number; //TODO: needed?
}

export interface gameInfo {
	gameID: number,
	tournamentID: number,
	remote: boolean,
	users: [user, user],
	score: [number, number],
	winnerID: number,
	loserID: number
}

export interface ballObj {
	x: number,
	y: number,
	dx: number,
	dy: number,
	radius: number
}

export interface paddleSpec {
	speed: number
	width: number,
	height: number,
	halfWidth: number,
	halfHeight: number
}

export interface playerReq {
	_id: number,
	_req: reqObj,
} //TODO: find better way to register a req

export type playerTab = Array< Player >;
type reqTab = Array< playerReq >;

export class Game {
	/*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_nc: NatsConnection;
	#_players: playerTab; //TODO: replace tab with 2 player objects ?
	#_ball: ballObj;
	#_ballDir: number;
	#_paddleSpec: paddleSpec;
	#_reqHistory: reqTab;
	#_lastTick: number;
	#_timeoutIDs: Array< NodeJS.Timeout >;

	/*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo, nc: NatsConnection) {
		this.#_gameInfo = gameInfo;
		this.#_nc = nc;
		this.#_players = new Array();
		this.#_ball = {
			x: WIDTH / 2, 
			y: HEIGHT / 2, 
			dx: 0.3, 
			dy: 0.03,
			radius: 15
		};
		this.#_paddleSpec = {
			speed: 0.3,
			width: 18, 
			height: HEIGHT / 6, 
			halfWidth: 18 / 2, 
			halfHeight: HEIGHT / 12
		}; //custom
		this.#_ballDir = -1;
		this.#_reqHistory = new Array();
		this.#_lastTick = 0;
		this.#_timeoutIDs = new Array();
	}

	/*                              GETTERS                                  */
	get nc(): NatsConnection {
		return this.#_nc;
	}

	get infos(): gameInfo {
		return this.#_gameInfo;
	}

	get gameID(): number {
		return this.#_gameInfo.gameID;
	}

	get players(): playerTab {
		return this.#_players;
	}

	get local(): boolean {
		if (this.#_gameInfo.remote)
			return false
		return true;
	}

	get randUserID(): number {
		return this.#_gameInfo.users[1]!.userID;
	}
		
	get ball(): ballObj {
		return this.#_ball;
	}

	get padSpec(): paddleSpec {
		return this.#_paddleSpec;
	}

	get reqHistory(): reqTab {
		return this.#_reqHistory;
	}

	get lastTick(): number {
		return this.#_lastTick;
	}

	get ballDir(): number {
		return this.#_ballDir;
	}

	/*                              SETTERS                                  */
	set reqHistory(reqTab: reqTab) {
		this.#_reqHistory = reqTab;
	}

	set lastTick(time: number) {
		this.#_lastTick = time;
	}

	set ballDir(direction: number) {
		this.#_ballDir = direction;
	}

	/*                              METHODS                                  */
	public addPlayer(userID: number, socket: WebSocket, clientSide: string) {
		let serverSide: string = "left";
		if (this.#_players.length === 1)
			serverSide = "right";
		const player: Player = new Player(userID, socket, serverSide, clientSide, this.#_paddleSpec);
		this.#_players.push(player);
	}

	public deletePlayers() {
		this.#_players.forEach((player: Player) => {
			if (player.socket.readyState === 1) //TODO: ou 0 ?
				player.socket.close();
		})
		this.#_players.splice(0, this.#_players.length);

	} //TODO: to be removed. only for testing

	public addReq(req: reqObj, id: number) {
		const newReq: playerReq = { _id: id, _req: structuredClone(req)};
		this.#_reqHistory.push(newReq);
	}

	public deleteReq(deleteCount: number) {
		this.#_reqHistory.splice(0, deleteCount);
	}

	public addTimoutID(ID: NodeJS.Timeout) {
		this.#_timeoutIDs.push(ID);
	}

	public cleanTimeoutIDs() {
		this.#_timeoutIDs.forEach((ID) => clearTimeout(ID));
	}

	public fillGameInfos() {
		const user1: number = this.#_gameInfo.users[0].userID;
		const user2: number = this.#_gameInfo.users[1].userID;
		let score1: number = 0;
		let score2: number = 0;
		if (this.#_players[0]) {
			if (this.#_players[0].userID === user1)
				score1 = this.#_players[0].score;
			else
				score2 = this.#_players[0].score;
		}
		if (this.#_players[1]) {
			if (this.#_players[1].userID === user1)
				score1 = this.#_players[1].score;
			else
				score2 = this.#_players[1].score;
		}
		this.#_gameInfo.score = [score1, score2];
		if (score1 > score2) {
			this.#_gameInfo.winnerID = user1;
			this.#_gameInfo.loserID = user2;
		}
		else {
			this.#_gameInfo.winnerID = user2;
			this.#_gameInfo.loserID = user1;
		}
		console.log("GAME INFO", JSON.stringify(this.#_gameInfo));
	}
}
