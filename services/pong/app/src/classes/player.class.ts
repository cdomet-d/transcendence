import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, paddleSpec, WIDTH, type ballObj } from './game.class.js';

export interface coordinates {
	x: number;
	y: number;
}

export interface repObj {
	_ID: number,
	_timestamp: number, // only used client side
	_leftPad: coordinates,
	_rightPad: coordinates,
	_ball: ballObj,
	_score: [number, number]
}

export class Player {
	/*                             PROPERTIES                                */
	#_userID: number;
	#_socket: WebSocket;
	#_serverSide: string;
	#_clientSide: string;
	#_paddle: coordinates;
	#_score: number;
	#_reply: repObj;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, serverSide: string, clientSide: string, padSpec: paddleSpec) {
		this.#_userID = userID;
		this.#_socket = socket;
		this.#_reply = {
			_ID: 0, 
			_timestamp: 0, 
			_leftPad: {
				x: 25, 
				y: HEIGHT / 2 - padSpec.halfHeight
			},
			_rightPad: {
				x: WIDTH - (padSpec.width + 25), 
				y: HEIGHT / 2 - padSpec.halfHeight
			},
			_ball: {
				x: WIDTH / 2, 
				y: HEIGHT / 2, 
				dx: 0.3,
				dy: 0.03, 
				radius: 15}, 
			_score: [0, 0]
		};
		this.#_serverSide = serverSide;
		if (serverSide === "right")
			this.#_paddle = {
				x: WIDTH - (padSpec.width + 25), 
				y: HEIGHT / 2 - padSpec.halfHeight
			};
		else
			this.#_paddle = {
				x: 25, 
				y: HEIGHT / 2 - padSpec.halfHeight
			};
		this.#_clientSide = clientSide;
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
		if (this.#_clientSide === "left")
			return true;
		return false;
	}

	get right(): boolean {
		if (this.#_clientSide === "right")
			return true;
		return false;
	}
	
	get score(): number {
		return this.#_score;
	}

	get userID(): number {
		return this.#_userID;
	}

	/*                              METHODS                                  */
	public sendReply(ball: ballObj, opponent: Player) {
		// paddles and ball
		this.#_reply._leftPad.y = this.#_paddle.y;
		this.#_reply._rightPad.y = opponent.paddle.y;
		this.#_reply._ball = { ...ball };
		if (this.#_serverSide === "right") {
			this.#_reply._ball.x = WIDTH - ball.x;
			this.#_reply._ball.dx *= -1;
			this.#_reply._leftPad.x = WIDTH - this.#_paddle.x;
			this.#_reply._rightPad.x = WIDTH - opponent.paddle.x;
		}
		else {
			this.#_reply._leftPad.x = this.#_paddle.x;
			this.#_reply._rightPad.x = opponent.paddle.x;
		}

		// score
		this.#_reply._score = [this.#_score, opponent.#_score];

		// send
		if (this.#_socket.readyState === 1 )
			this.#_socket.send(JSON.stringify(this.#_reply));
	}

	public incScore() {
		this.#_score += 1;
	}
}
