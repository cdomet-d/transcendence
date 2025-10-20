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
	lastdx: number
}

interface timeObj {
	stamp: number,
	lastFrame: number,
	delta: number,
}

interface playerReq {
	_playerId: number,
	_req: reqObj,
}

export interface stateObj {
	_timestamp: number,
	_leftPad: coordinates,
	_rightPad: coordinates,
	_ball: ballObj,
}

export type playerTab = Array< Player >;
type reqTab = Array< playerReq >;
type stateTab = Array< stateObj >;

export class Game {
	/*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_players: playerTab;
	#_ball: ballObj;
	#_paddleSpeed: number;
	#_time: timeObj;
	#_status: boolean;
	#_reqHistory: reqTab;
	#_stateHistory: stateTab;

	/*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo) {
		this.#_gameInfo = gameInfo;
		this.#_status = false;
		this.#_players = new Array();
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3};
		this.#_paddleSpeed = 0.15;
		this.#_time = { stamp: 0, lastFrame: 0, delta: 0};
		this.#_reqHistory = new Array();
		this.#_stateHistory = new Array();
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

	get time(): timeObj {
		return this.#_time;
	}

	get status(): boolean {
		return this.#_status;
	}

	get reqHistory(): reqTab {
		return this.#_reqHistory;
	}
	
	get stateHistory(): stateTab {
		return this.#_stateHistory;
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

	set status(status: boolean) {
		this.#_status = status;
	}

	set reqHistory(reqTab: reqTab) {
		this.#_reqHistory = reqTab;
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
		const newReq: playerReq = { _playerId: id, _req: structuredClone(req)};
		this.#_reqHistory.push(newReq);
	}

	public deleteReq(deleteCount: number) {
		this.#_reqHistory.splice(0, deleteCount);
	}

	public addState(timestamp: number) {
		if (!this.#_players[0] || !this.#_players[1]) return;
			return;
		const newState: stateObj = { _timestamp: timestamp, _leftPad: { ...this.#_players[0]!.paddle}, _rightPad: { ...this.#_players[1]!.paddle}, _ball: { ...this.#_ball} };
		this.#_stateHistory.push(newState);
	}

	public deleteStates(length: number) {
		this.#_stateHistory.splice(0, length);
	}

	public updateState(idx: number) {
		this.#_stateHistory[idx]!._leftPad = { ...this.#_players[0]!.paddle};
		this.#_stateHistory[idx]!._rightPad = { ...this.#_players[1]!.paddle};
		this.#_stateHistory[idx]!._ball = { ...this.#_ball};
	}
}
