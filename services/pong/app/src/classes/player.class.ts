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
	#_score: number;
	#_reply: repObj;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, random: boolean) {
		this.#_userID = userID;
		this.#_socket = socket;
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

	/*                              METHODS                                  */
	public sendReply(side: string, ball: ballObj, rightY: number) {
		// paddles
		this.#_reply._leftPad.y = this.#_paddle.y;
		this.#_reply._rightPad.y = rightY;

		// ball
		this.#_reply._ball = { ...ball };
		if (side === "right") {
			this.#_reply._ball.x = WIDTH - ball.x;
			this.#_reply._ball.dx *= -1;
		}
		//TODO: add score

		// send
		if (this.#_socket.readyState === 1 )
			this.#_socket.send(JSON.stringify(this.#_reply));
	}

	public incScore() {
		this.#_score += 1;
	}
}
