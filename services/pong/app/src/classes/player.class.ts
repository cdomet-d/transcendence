import type { WebSocket } from '@fastify/websocket';
import { HEIGHT, WIDTH } from './game.class.js';

export interface ballObj {
	x: number,
	y: number
}

export interface paddleObj {
    x: number;
    y: number;
}

export interface repObj {
	leftPad: paddleObj,
	rightPad: paddleObj,
	ball: ballObj,
}

export class Player {
    /*                             PROPERTIES                                */
    #_userID: number;
	#_ball: ballObj;
    #_paddle: paddleObj;
    #_side: string;
    #_socket: WebSocket;
    #_rep: repObj;

    /*                            CONSTRUCTORS                               */
    constructor(userID: number, socket: WebSocket, random: boolean) {
        this.#_userID = userID;
        this.#_socket = socket;
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2};
        this.#_rep = {leftPad: {x: 10, y: 108}, rightPad: {x: 460, y: 108}, ball: {x: WIDTH / 2, y: HEIGHT / 2}};
        if (random) {
            this.#_paddle = {x: 460, y: 108};
            this.#_side = "right";
        }
        else {
            this.#_paddle = {x: 10, y: 108};
            this.#_side = "left";
        }
    }

    /*                              GETTERS                                  */
    get socket(): WebSocket {
        return this.#_socket;
    }

    get paddle(): paddleObj {
        return this.#_paddle;
    }

    get rep(): repObj {
        return this.#_rep;
    }

    get left(): boolean {
        if (this.#_side === "left")
            return true;
        return false;
    }

    get right(): boolean {
        if (this.#_side === "right")
            return true;
        return false;
    }
    
	get ball(): ballObj {
        return this.#_ball;
    }

    /*                              METHODS                                  */
    public setMessPad(side: string, newPos: number) {
        if (side === "left")
            this.#_rep.leftPad.y = newPos;
        else
            this.#_rep.rightPad.y = newPos;
    }

    public setMessBall() {
        this.#_rep.ball.x = this.#_ball.x;
        this.#_rep.ball.y = this.#_ball.y;
    }
}
