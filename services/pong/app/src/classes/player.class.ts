import type { WebSocket } from '@fastify/websocket';

export interface paddleObj {
    x: number;
    y: number;
}

export interface repObj {
	leftPadY: number,
	rightPadY: number,
}

export class Player {
    /*                             PROPERTIES                                */
    #_userID: number;
    #_paddle: paddleObj;
    #_side: string;
    #_socket: WebSocket;
    #_rep: repObj;

    /*                            CONSTRUCTORS                               */
    constructor(userID: number, socket: WebSocket, random: boolean) {
        this.#_userID = userID;
        this.#_socket = socket;
        this.#_rep = {leftPadY: 108, rightPadY: 108};
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
    
    /*                              METHODS                                  */
    public setMess(side: string, newPos: number) {
        if (side === "left")
            this.#_rep.leftPadY = newPos;
        else
            this.#_rep.rightPadY = newPos;
    }
}
