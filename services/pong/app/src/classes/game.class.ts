import { Player } from './player.class.js';
import type { WebSocket } from '@fastify/websocket';
import { NatsConnection } from 'nats';
import type { reqObj, playerReq, gameInfo, ballObj, paddleSpec } from './game.interfaces.js';

export const HEIGHT = 558.9;
export const WIDTH = 1000;

export type playerTab = Array< Player >;
type reqTab = Array< playerReq >;

export class Game {
	/*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_nc: NatsConnection;
	#_players: playerTab;
	#_ball: ballObj;
	#_ballDir: number;
	#_paddleSpec: paddleSpec;
	#_reqHistory: reqTab;
	#_lastTick: number;
	#_timeoutIDs: Array< NodeJS.Timeout >;
	#_startTimestamp: number;
	#_passStart: number;
	#_endSent: boolean;
	#_lastBall: boolean;
	#_startLoop: number;
	#_remainingTickTime: number;

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
			r: 13
		};
		this.#_paddleSpec = {
			speed: 0.45,
			w: 20, 
			h: HEIGHT / 5, 
			halfW: 20 / 2, 
			halfH: HEIGHT / 10
		}; //custom
		this.#_ballDir = -1;
		this.#_reqHistory = new Array();
		this.#_lastTick = 0;
		this.#_timeoutIDs = new Array();
		this.#_startTimestamp = 0;
		this.#_passStart = 0;
		this.#_endSent = false;
		this.#_lastBall = false;
		this.#_startLoop = 0;
		this.#_remainingTickTime = 0;
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

	get startTimestamp(): number {
		return this.#_startTimestamp;
	}

	get passStart(): number {
		return this.#_passStart;
	}

	get endSent(): boolean {
		return this.#_endSent;
	}

	get lastBall(): boolean {
		return this.#_lastBall;
	}

	get startLoop(): number {
		return this.#_startLoop;
	}

	get remainingTickTime(): number {
		return this.#_remainingTickTime;
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

	set startTimestamp(timestamp: number) {
		this.#_startTimestamp = timestamp;
	}

	set passStart(timestamp: number) {
		this.#_passStart = timestamp;
	}

	set endSent(state: boolean) {
		this.#_endSent = state;
	}

	set lastBall(state: boolean) {
		this.#_lastBall = state;
	}

	set startLoop(timestamp: number) {
		this.#_startLoop = timestamp;
	}

	set remainingTickTime(time: number) {
		this.#_remainingTickTime = time;
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

	}

	public addReq(req: reqObj, id: number) {
		const newReq: playerReq = { _id: id, _req: structuredClone(req)};
		this.#_reqHistory.push(newReq);
	}

	public deleteReq() {
		this.#_reqHistory.splice(this.#_reqHistory.length);
	}

	public addTimoutID(ID: NodeJS.Timeout) {
		this.#_timeoutIDs.push(ID);
	}

	public cleanTimeoutIDs() {
		this.#_timeoutIDs.forEach((ID) => clearTimeout(ID));
	}

	public fillGameInfos() {
		this.#_gameInfo.duration = (performance.now() - this.#_startTimestamp) / 1000;
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
	}
}
