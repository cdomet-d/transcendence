import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH } from './game.class.js';
import type { coordinates, repObj, paddleSpec, ballObj } from './game.interfaces.js';

export class Player {
	/*                             PROPERTIES                                */
	#_userID: number;
	#_socket: WebSocket;
	#_serverSide: string;
	#_clientSide: string;
	#_paddle: coordinates;
	#_padStep: coordinates;
	#_score: number;
	#_reply: repObj;

	/*                            CONSTRUCTORS                               */
	constructor(userID: number, socket: WebSocket, serverSide: string, clientSide: string, padSpec: paddleSpec) {
		this.#_userID = userID;
		this.#_socket = socket;
		this.#_reply = {
			_ID: 0, 
			_timestamp: 0, 
			_leftPad: {coord: {x: 25, y: HEIGHT / 2 - padSpec.halfH}, step: {x: 0, y: 0}},
			_rightPad: {
				coord: {x: WIDTH - (padSpec.w + 25), y: HEIGHT / 2 - padSpec.halfH},
				step: {x: 0, y: 0}},
			_ball: {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.03, r: 15}, 
			_score: [0, 0],
			_end: false
		};
		this.#_serverSide = serverSide;
		if (serverSide === "right")
			this.#_paddle = {x: WIDTH - (padSpec.w + 25), y: HEIGHT / 2 - padSpec.halfH};
		else
			this.#_paddle = {x: 25, y: HEIGHT / 2 - padSpec.halfH};
		this.#_padStep = { x: 0, y: 0};
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

	get padStep(): coordinates {
		return this.#_padStep;
	}

	get reply(): repObj {
		return this.#_reply;
	}

	get left(): boolean {
		if (this.#_serverSide === "left")
			return true;
		return false;
	}

	get right(): boolean {
		if (this.#_serverSide === "right")
			return true;
		return false;
	}
	
	get score(): number {
		return this.#_score;
	}

	get userID(): number {
		return this.#_userID;
	}

	/*                              SETTERS                                  */
	set score(score: number) {
		this.#_score = score;
	}
	
	/*                              METHODS                                  */
	public setPadStep() {
		this.#_padStep = { x: 0, y: 0 };
	}
	
	public sendReply(ball: ballObj, opponent: Player, padWidth: number) {
		// paddles and ball
		this.#_reply._leftPad.coord.y = this.#_paddle.y;
		this.#_reply._rightPad.coord.y = opponent.paddle.y;
		this.#_reply._leftPad.step.y = this.#_padStep.y;
		this.#_reply._ball = { ...ball };
		if (this.#_serverSide === "right" && this.#_clientSide === "left") {
			this.#_reply._ball.x = WIDTH - ball.x;
			this.#_reply._ball.dx *= -1;
			this.#_reply._leftPad.coord.x = WIDTH - this.#_paddle.x - padWidth;
			this.#_reply._rightPad.coord.x = WIDTH - opponent.paddle.x - padWidth;
			this.#_reply._leftPad.step.x = this.#_padStep.x * -1;
			this.#_reply._rightPad.step = {x: 0, y: 0};
		}
		else {
			this.#_reply._leftPad.coord.x = this.#_paddle.x;
			this.#_reply._rightPad.coord.x = opponent.paddle.x;
			this.#_reply._leftPad.step.x = this.#_padStep.x;
			this.#_reply._rightPad.step = { ...opponent.padStep };
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
