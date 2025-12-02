import type { WebSocket } from '@fastify/websocket';

type usersTab = Map< string, WebSocket >

export class Users {
    /*                             PROPERTIES                                */
    #users: usersTab;

	/*                            CONSTRUCTORS                               */
    constructor() {
        this.#users = new Map();
    }

    /*                              GETTERS                                  */
    get userMap(): usersTab {
        return this.#users;
    }

	/*                              METHODS                                  */
    public addUser(userID: string, socket: WebSocket) {
        this.#users.set(userID, socket);
    }

    public deleteUser(userID: string) {
        this.#users.delete(userID);
    }

    public getUserSocket(userID: string): WebSocket | undefined {
        return this.#users.get(userID);
    }
}
