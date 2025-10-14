import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH, type ballObj } from './game.class.js';
import type { reqObj, keysObj } from '../game/mess.validation.js';

export interface coordinates {
	x: number;
	y: number;
}

export interface repObj {
	ID: number,
	leftPad: coordinates,
	rightPad: coordinates,
	ball: coordinates,
}

export class Player {
	/*                             PROPERTIES                                */
	#_userID: number;
	#_socket: WebSocket;
	#_playerSide: string;
	#_paddle: coordinates;
	#_keys: keysObj;
	#_rep: repObj;
	#_score: number;
	#_clientReq: reqObj;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, random: boolean) {
		this.#_userID = userID;
		this.#_socket = socket;
		this.#_keys = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
		this.#_rep = {ID: 0, leftPad: {x: 10, y: 108}, rightPad: {x: 460, y: 108}, ball: {x: WIDTH / 2, y: HEIGHT / 2}};
		if (random) {
			this.#_paddle = {x: 460, y: 108};
			this.#_playerSide = "right";
		}
		else {
			this.#_paddle = {x: 10, y: 108};
			this.#_playerSide = "left";
		}
		this.#_score = 0;
		this.#_clientReq = { _ID: 0, _keys: { ...this.#_keys }, _timeStamp: 0};
	}

	/*                              GETTERS                                  */
	get socket(): WebSocket {
		return this.#_socket;
	}

	get paddle(): coordinates {
		return this.#_paddle;
	}

	get rep(): repObj {
		return this.#_rep;
	}

	get left(): boolean {
		if (this.#_playerSide === "left")
			return true;
		return false;
	}

	get right(): boolean {
		if (this.#_playerSide === "right")
			return true;
		return false;
	}
	
	get score(): number {
		return this.#_score;
	}

	get keys(): keysObj {
		return this.#_keys;
	}

	get clientReq(): reqObj {
		return this.#_clientReq;
	}

	/*                              SETTERS                                  */
	set keys(keys: keysObj) {
		this.#_keys = keys;
	}

	set clientReq(mess: reqObj) {
		this.#_clientReq = mess;
	}

	/*                              METHODS                                  */
	public setMessPad(side: string, newPos: number) {
		if (side === "left")
			this.#_rep.leftPad.y = newPos;
		else
			this.#_rep.rightPad.y = newPos;
	}

	public setMessBall(side: string, ball: ballObj) {
		this.#_rep.ball.y = ball.y;
		if (side === "left")
			this.#_rep.ball.x = ball.x;
		else
			this.#_rep.ball.x = WIDTH - ball.x;
	}

	public incScore() {
		this.#_score += 1;
	}
}
