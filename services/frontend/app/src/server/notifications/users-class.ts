import type { WebSocket } from '@fastify/websocket';

type usersTab = Map< number, WebSocket >

export class Users {
    /*                             PROPERTIES                                */
    #users: usersTab;

	/*                            CONSTRUCTORS                               */
    constructor() {
        this.#users = new Map();
    }

	/*                              METHODS                                  */
    public addUser(userID: number, socket: WebSocket) {
        this.#users.set(userID, socket);
    }

    public deleteUser(userID: number) {
        this.#users.delete(userID);
    }

    public getUserSocket(userID: number): WebSocket | undefined {
        return this.#users.get(userID);
    }
}
