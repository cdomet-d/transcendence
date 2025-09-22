import type { WebSocket } from '@fastify/websocket';

export interface paddlePos {
    x: number;
    y: number;
}

export class Player {
    /*                             PROPERTIES                                */
    #_userID: number;
    #_socket: WebSocket;
    #_paddle: paddlePos;

    /*                            CONSTRUCTORS                               */
    constructor(userID: number, socket: WebSocket) {
        this.#_userID = userID;
        this.#_socket = socket;
        this.#_paddle = {x: 0, y: 0};
    }

    /*                              GETTERS                                  */
    get socket(): WebSocket {
        return this.#_socket;
    }

    get paddle(): paddlePos {
        return this.#_paddle;
    }

    /*                              METHODS                                  */
    public setLeftPaddle() {
        this.#_paddle = {x: 10, y: 108};
    }

    public setRightPaddle() {
        this.#_paddle = {x: 460, y: 108};
    }
}
