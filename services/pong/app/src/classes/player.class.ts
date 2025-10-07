import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH, type ballObj } from './game.class.js';

export interface coordinates {
	x: number;
	y: number;
}

export interface repObj {
	leftPad: coordinates,
	rightPad: coordinates,
	ball: coordinates,
}

interface speedObj {
	paddle: number,
}

export class Player {
	/*                             PROPERTIES                                */
	#_userID: number;
	#_ballMaster: boolean;
	#_speed: speedObj;
	#_paddle: coordinates;
	#_playerSide: string;
	#_socket: WebSocket;
	#_rep: repObj;
	#_score: number;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, random: boolean) {
		this.#_userID = userID;
		this.#_socket = socket;
		this.#_ballMaster = false;
		this.#_rep = {leftPad: {x: 10, y: 108}, rightPad: {x: 460, y: 108}, ball: {x: WIDTH / 2, y: HEIGHT / 2}};
		if (random) {
			this.#_paddle = {x: 460, y: 108};
			this.#_playerSide = "right";
		}
		else {
			this.#_paddle = {x: 10, y: 108};
			this.#_playerSide = "left";
		}
		this.#_speed = {paddle: 0.2};
		this.#_score = 0;
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
	
	get ballMaster(): boolean {
		return this.#_ballMaster
	}

	get speed(): speedObj {
		return this.#_speed;
	}
	
	get score(): number {
		return this.#_score;
	}

	/*                              SETTERS                                  */
	set ballMaster(bool: boolean) {
		this.#_ballMaster = bool;
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
