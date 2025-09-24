import type { WebSocket } from '@fastify/websocket';

export interface paddlePos {
    x: number;
    y: number;
}

// type messMap = Map< string, number >;
export interface messObj {
	leftPad: number | undefined,
	rightPad: number | undefined,
}


export class Player {
    /*                             PROPERTIES                                */
    #_userID: number;
    #_socket: WebSocket;
    #_paddle: paddlePos;
    #_mess: messObj;

    /*                            CONSTRUCTORS                               */
    constructor(userID: number, socket: WebSocket) {
        this.#_userID = userID;
        this.#_socket = socket;
        this.#_paddle = {x: 0, y: 0};
        this.#_mess = {leftPad: undefined, rightPad: undefined};
    }

    /*                              GETTERS                                  */
    get socket(): WebSocket {
        return this.#_socket;
    }

    get paddle(): paddlePos {
        return this.#_paddle;
    }

    get mess(): messObj {
        return this.#_mess;
    }

    /*                              SETTERS                                  */
    set paddle(pad: paddlePos) {
        this.#_paddle = pad;
    }

    /*                              METHODS                                  */
    public setMess(side: string, newPos: number) {
        if (side === "left")
            this.#_mess.leftPad = newPos;//this.#_paddle.y;
        else
            this.#_mess.rightPad = newPos;//this.#_paddle.y;
    }
}
