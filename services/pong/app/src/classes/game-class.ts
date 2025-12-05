import { Player } from './player-class.js';
import type { WebSocket } from '@fastify/websocket';
import { NatsConnection } from 'nats';
import type { reqObj, playerReq, gameInfo, ballObj, paddleSpec } from './game-interfaces.js';
import { FastifyBaseLogger } from 'fastify';

export const HEIGHT = 558.9;
export const WIDTH = 1000;

export type playerTab = Array< Player >;
type reqTab = Array< playerReq >;

export class Game {
	/*                             PROPERTIES                                */
	#gameInfo: gameInfo;
	#nc: NatsConnection;
	#players: playerTab;
	#ball: ballObj;
	#ballDir: number;
	#paddleSpec: paddleSpec;
	#reqHistory: reqTab;
	#lastTick: number;
	#timeoutIDs: Array< NodeJS.Timeout >;
	#startTimestamp: number;
	#passStart: number;
	#endSent: boolean;
	#lastBall: boolean;
	#startLoop: number;
	#log: FastifyBaseLogger;
	#remainingTickTime: number;

	/*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo, nc: NatsConnection, log: FastifyBaseLogger) {
		this.#gameInfo = gameInfo;
		this.#nc = nc;
		this.#log = log
		this.#players = new Array();
		this.#ball = {
			x: WIDTH / 2, 
			y: HEIGHT / 2, 
			dx: 0.45, 
			dy: 0.03,
			maxSpeed: 0.85,
			r: 13
		};
		this.#paddleSpec = {
			speed: 0.42,
			w: 20, 
			h: HEIGHT / 5, 
			halfW: 20 / 2, 
			halfH: HEIGHT / 10
		}; //custom
		this.#ballDir = -1;
		this.#reqHistory = new Array();
		this.#lastTick = 0;
		this.#timeoutIDs = new Array();
		this.#startTimestamp = 0;
		this.#passStart = 0;
		this.#endSent = false;
		this.#lastBall = false;
		this.#startLoop = 0;
		this.#remainingTickTime = 0;
	}

	/*                              GETTERS                                  */
	get nc(): NatsConnection {
		return this.#nc;
	}

	get log(): FastifyBaseLogger {
		return this.#log;
	}

	get infos(): gameInfo {
		return this.#gameInfo;
	}

	get gameID(): string {
		return this.#gameInfo.gameID;
	}

	get players(): playerTab {
		return this.#players;
	}

	get local(): boolean {
		if (this.#gameInfo.remote)
			return false
		return true;
	}

	get randUserID(): string {
		return this.#gameInfo.users[1]!.userID;
	}
		
	get ball(): ballObj {
		return this.#ball;
	}

	get padSpec(): paddleSpec {
		return this.#paddleSpec;
	}

	get reqHistory(): reqTab {
		return this.#reqHistory;
	}

	get lastTick(): number {
		return this.#lastTick;
	}

	get ballDir(): number {
		return this.#ballDir;
	}

	get startTimestamp(): number {
		return this.#startTimestamp;
	}

	get passStart(): number {
		return this.#passStart;
	}

	get endSent(): boolean {
		return this.#endSent;
	}

	get lastBall(): boolean {
		return this.#lastBall;
	}

	get startLoop(): number {
		return this.#startLoop;
	}

	get remainingTickTime(): number {
		return this.#remainingTickTime;
	}

	/*                              SETTERS                                  */
	set reqHistory(reqTab: reqTab) {
		this.#reqHistory = reqTab;
	}

	set lastTick(time: number) {
		this.#lastTick = time;
	}

	set ballDir(direction: number) {
		this.#ballDir = direction;
	}

	set startTimestamp(timestamp: number) {
		this.#startTimestamp = timestamp;
	}

	set passStart(timestamp: number) {
		this.#passStart = timestamp;
	}

	set endSent(state: boolean) {
		this.#endSent = state;
	}

	set lastBall(state: boolean) {
		this.#lastBall = state;
	}

	set startLoop(timestamp: number) {
		this.#startLoop = timestamp;
	}

	set remainingTickTime(time: number) {
		this.#remainingTickTime = time;
	}

	/*                              METHODS                                  */
	public addPlayer(userID: string, socket: WebSocket, clientSide: string) {
		let serverSide: string = "left";
		if (this.#players.length === 1)
			serverSide = "right";
		const player: Player = new Player(userID, socket, serverSide, clientSide, this.#paddleSpec, this.#ball);
		this.#players.push(player);
	}

	public deletePlayers() {
		this.#players.forEach((player: Player) => {
			if (player.socket.readyState === 1) //TODO: ou 0 ?
				player.socket.close();
		})
		this.#players.splice(0, this.#players.length);
	}

	public addReq(req: reqObj, id: number) {
		const newReq: playerReq = { id: id, req: structuredClone(req)};
		this.#reqHistory.push(newReq);
	}

	public deleteReq() {
		this.#reqHistory.splice(this.#reqHistory.length);
	}

	public addTimoutID(ID: NodeJS.Timeout) {
		this.#timeoutIDs.push(ID);
	}

	public cleanTimeoutIDs() {
		this.#timeoutIDs.forEach((ID) => clearTimeout(ID));
	}

	public fillGameInfos() {
		this.#gameInfo.duration = (performance.now() - this.#startTimestamp) / 1000;
		const user1: string = this.#gameInfo.users[0].userID;
		const user2: string = this.#gameInfo.users[1].userID;
		let score1: number = 0;
		let score2: number = 0;
		if (this.#players[0]) {
			if (this.#players[0].userID === user1)
				score1 = this.#players[0].score;
			else
				score2 = this.#players[0].score;
		}
		if (this.#players[1]) {
			if (this.#players[1].userID === user1)
				score1 = this.#players[1].score;
			else
				score2 = this.#players[1].score;
		}
		if (score1 > score2) {
			this.#gameInfo.winnerID = user1;
			this.#gameInfo.loserID = user2;
			this.#gameInfo.score = [score1, score2];
		}
		else {
			this.#gameInfo.winnerID = user2;
			this.#gameInfo.loserID = user1;
			this.#gameInfo.score = [score2, score1];
		}
	}
}
