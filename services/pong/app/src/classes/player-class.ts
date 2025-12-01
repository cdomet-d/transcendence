import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH } from './game-class.js';
import type { coordinates, repObj, paddleSpec, ballObj } from './game-interfaces.js';

export class Player {
	/*                             PROPERTIES                                */
	#userID: string;
	#socket: WebSocket;
	#serverSide: string;
	#clientSide: string;
	#paddle: coordinates;
	#padStep: coordinates;
	#score: number;
	#reply: repObj;

	/*                            CONSTRUCTORS                               */
	constructor(userID: string, socket: WebSocket, serverSide: string, clientSide: string, padSpec: paddleSpec, ballSpec: ballObj) {
		this.#userID = userID;
		this.#socket = socket;
		this.#reply = {
			ID: "", 
			timestamp: 0, 
			leftPad: {coord: {x: 25, y: HEIGHT / 2 - padSpec.halfH}, step: {x: 0, y: 0}},
			rightPad: {
				coord: {x: WIDTH - (padSpec.w + 25), y: HEIGHT / 2 - padSpec.halfH},
				step: {x: 0, y: 0}},
			ball: {...ballSpec}, 
			score: [0, 0],
			end: false
		};
		this.#serverSide = serverSide;
		if (serverSide === "right")
			this.#paddle = {x: WIDTH - (padSpec.w + 25), y: HEIGHT / 2 - padSpec.halfH};
		else
			this.#paddle = {x: 25, y: HEIGHT / 2 - padSpec.halfH};
		this.#padStep = { x: 0, y: 0};
		this.#clientSide = clientSide;
		this.#score = 0;
	}

	/*                              GETTERS                                  */
	get socket(): WebSocket {
		return this.#socket;
	}

	get paddle(): coordinates {
		return this.#paddle;
	}

	get padStep(): coordinates {
		return this.#padStep;
	}

	get reply(): repObj {
		return this.#reply;
	}

	get left(): boolean {
		if (this.#serverSide === "left")
			return true;
		return false;
	}

	get right(): boolean {
		if (this.#serverSide === "right")
			return true;
		return false;
	}
	
	get score(): number {
		return this.#score;
	}

	get userID(): string {
		return this.#userID;
	}

	/*                              SETTERS                                  */
	set score(score: number) {
		this.#score = score;
	}
	
	/*                              METHODS                                  */
	public setPadStep() {
		this.#padStep = { x: 0, y: 0 };
	}
	
	public sendReply(ball: ballObj, opponent: Player, padWidth: number) {
		// paddles and ball
		this.#reply.ball = { ...ball };
		this.#reply.leftPad.coord.y = this.#paddle.y;
		this.#reply.rightPad.coord.y = opponent.paddle.y;
		this.#reply.leftPad.step.y = this.#padStep.y;
		if (this.#serverSide === "right" && this.#clientSide === "left") {
			this.#reply.ball.x = WIDTH - ball.x;
			this.#reply.ball.dx *= -1;
			this.#reply.leftPad.coord.x = WIDTH - this.#paddle.x - padWidth;
			this.#reply.rightPad.coord.x = WIDTH - opponent.paddle.x - padWidth;
			this.#reply.leftPad.step.x = this.#padStep.x * -1;
			this.#reply.rightPad.step = {x: 0, y: 0};
		}
		else {
			this.#reply.leftPad.coord.x = this.#paddle.x;
			this.#reply.rightPad.coord.x = opponent.paddle.x;
			this.#reply.leftPad.step.x = this.#padStep.x;
			this.#reply.rightPad.step = { ...opponent.padStep };
		}

		// score
		this.#reply.score = [this.#score, opponent.#score];

		// send
		if (this.#socket.readyState === 1 )
			this.#socket.send(JSON.stringify(this.#reply));
	}

	public incScore() {
		this.#score += 1;
	}
}
