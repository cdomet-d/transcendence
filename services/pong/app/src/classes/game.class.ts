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

export interface playerReq {
	_id: number,
	_req: reqObj,
}

export interface snapshotObj {
	_timestamp: number,
	_leftPad: coordinates,
	_rightPad: coordinates,
	_ball: ballObj,
}

export type playerTab = Array< Player >;
type reqTab = Array< playerReq >;
type snapshotTab = Array< snapshotObj >;

export class Game {
	/*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_players: playerTab;
	#_ball: ballObj;
	#_paddleSpeed: number;
	#_reqHistory: reqTab;
	#_snapshotHistory: snapshotTab;
	#_lastTick: number

	/*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo) {
		this.#_gameInfo = gameInfo;
		this.#_players = new Array();
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3};
		this.#_paddleSpeed = 0.15;
		this.#_reqHistory = new Array();
		this.#_snapshotHistory = new Array();
		this.#_lastTick = 0;
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
	
	get snapshotHistory(): snapshotTab {
		return this.#_snapshotHistory;
	}

	get lastTick(): number {
		return this.#_lastTick;
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

	public addSnapshot(timestamp: number) {
		if (!this.#_players[0] || !this.#_players[1])
			return;
		const newSnapshot: snapshotObj = { _timestamp: timestamp, _leftPad: { ...this.#_players[0]!.paddle}, _rightPad: { ...this.#_players[1]!.paddle}, _ball: { ...this.#_ball} };
		this.#_snapshotHistory.push(newSnapshot);
	}

	public deleteSnapshots(timestamp: number) {
		this.#_snapshotHistory = this.#_snapshotHistory.filter(
			snapshot => snapshot._timestamp >= timestamp
		);
	}

	public findSnapshot(req: reqObj): snapshotObj | undefined {
		let snapshot: snapshotObj | undefined = undefined;
		const timestamp: number = req._timeStamp;
		const tab: snapshotTab = this.#_snapshotHistory;
		let i: number = 0;

		while( i < tab.length - 1) {
			if (timestamp >= tab[i]!._timestamp
				&& timestamp <= tab[i + 1]!._timestamp) {
					if (Math.abs(timestamp - tab[i]!._timestamp) < Math.abs(timestamp - tab[i + 1]!._timestamp))
						snapshot = tab[i];
					else
						snapshot = tab[i + 1];
					break;
				}
			i++;
		}

		return snapshot;
	}
}
