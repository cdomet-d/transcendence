import type { Player, coordinates } from './player.class.js';
import type { reqObj } from '../game/mess.validation.js';

export const HEIGHT = 270;
export const WIDTH = 480;

export interface user {
	_username: string,
	_userID: number,
	//_score: number; //TODO: needed?
}

export interface gameInfo {
	_gameID: number,
	_score: Array<number>,
	_local: boolean,
	_users: Array<user>,
	_winner: number,
	_loser: number
}

export interface ballObj {
	x: number,
	y: number,
	dx: number,
	dy: number,
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
	#_players: playerTab; //TODO: replace tab with 2 player objects ?
	#_ball: ballObj;
	#_ballDir: number;
	#_paddleSpeed: number;
	#_reqHistory: reqTab;
	#_lastTick: number;
	#_timeoutID: NodeJS.Timeout | null;

	/*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo) {
		this.#_gameInfo = gameInfo;
		this.#_players = new Array();
		this.#_ball = {
			x: WIDTH / 2, 
			y: HEIGHT / 2, 
			dx: 0.3, 
			dy: 0.03
		};
		this.#_ballDir = -1;
		this.#_paddleSpeed = 0.2;
		this.#_reqHistory = new Array();
		this.#_lastTick = 0;
		this.#_timeoutID = null;
	}

	/*                              GETTERS                                  */
	get gameID(): number {
		return this.#_gameInfo._gameID;
	}

	get players(): playerTab {
		return this.#_players;
	}

	get local(): boolean {
		return this.#_gameInfo._local;
	}

	get randUserID(): number {
		return this.#_gameInfo._users[1]!._userID;
	}
		
	get ball(): ballObj {
		return this.#_ball;
	}
	
	get paddleSpeed(): number {
		return this.#_paddleSpeed;
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

	get timeoutID(): NodeJS.Timeout | null {
		return this.#_timeoutID;
	}

	/*                              SETTERS                                  */
	set score(score: Array< number >) {
		this.#_gameInfo._score = score;
	}

	set winner(winner: number) {
		this.#_gameInfo._winner = winner;
	}

	set loser(loser: number) {
		this.#_gameInfo._loser = loser;
	}

	set reqHistory(reqTab: reqTab) {
		this.#_reqHistory = reqTab;
	}

	set lastTick(time: number) {
		this.#_lastTick = time;
	}

	set ballDir(direction: number) {
		this.#_ballDir = direction;
	}

	set timeoutID(id: NodeJS.Timeout) {
		this.#_timeoutID = id;
	}

	/*                              METHODS                                  */
	public addPlayer(player: Player) {
		this.#_players.push(player);
	}

	public deletePlayers() {
		this.#_players.forEach((player: Player) => {
			if (player.socket.readyState === 1)
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
}
