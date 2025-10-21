import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH, type ballObj } from './game.class.js';
import type { reqObj, keysObj } from '../game/mess.validation.js';

export interface coordinates {
	x: number;
	y: number;
}

export interface repObj {
	_ID: number,
	_timestamp: number,
	_leftPad: coordinates,
	_rightPad: coordinates,
	_ball: ballObj,
}


export class Player {
	/*                             PROPERTIES                                */
	#_userID: number;
	#_socket: WebSocket;
	#_playerSide: string;
	#_paddle: coordinates;
	#_keys: keysObj;
	#_score: number;
	#_reply: repObj;
	#_syncClockCount: number;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, random: boolean) {
		this.#_userID = userID;
		this.#_socket = socket;
		this.#_keys = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
		this.#_reply = {_ID: 0, _timestamp: 0, _leftPad: {x: 10, y: 108}, _rightPad: {x: 460, y: 108}, _ball: {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3}};
		if (random) {
			this.#_paddle = {x: 460, y: 108};
			this.#_playerSide = "right";
		}
		else {
			this.#_paddle = {x: 10, y: 108};
			this.#_playerSide = "left";
		}
		this.#_score = 0;
		this.#_syncClockCount = 0;
	}

	/*                              GETTERS                                  */
	get socket(): WebSocket {
		return this.#_socket;
	}

	get paddle(): coordinates {
		return this.#_paddle;
	}

	get reply(): repObj {
		return this.#_reply;
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

	get syncClockCount(): number {
		return this.#_syncClockCount;
	}

	/*                              SETTERS                                  */
	set keys(keys: keysObj) {
		this.#_keys = keys;
	}

	/*                              METHODS                                  */
	public incSyncClockCount() {
		this.#_syncClockCount += 1;
	}

	public setMessPad(side: string, newPos: number) {
		if (side === "left")
			this.#_reply._leftPad.y = newPos;
		else
			this.#_reply._rightPad.y = newPos;
	}

	public setMessBall(side: string, ball: ballObj) {
		this.#_reply._ball.y = ball.y;
		this.#_reply._ball.dx = ball.dx;
		this.#_reply._ball.dy = ball.dy;
		if (side === "left")
			this.#_reply._ball.x = ball.x;
		else {
			this.#_reply._ball.x = WIDTH - ball.x;
			this.#_reply._ball.dx *= -1;
		}

	}

	public incScore() {
		this.#_score += 1;
	}

}
