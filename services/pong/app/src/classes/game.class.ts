import type { Player } from './player.class.js';

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
export type playerTab = Array< Player >;

export class Game {
    /*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_players: playerTab;
	#_ball: ballObj;
	#_paddleSpeed: number;
	#_time: timeObj;

    /*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo) {
		this.#_gameInfo = gameInfo;
		this.#_players = new Array();
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3};
		this.#_paddleSpeed = 0.2;
		this.#_time = { stamp: 0, lastFrame: 0, delta: 0};
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
}
