import type { WebSocket } from '@fastify/websocket';

type usersTab = Map<string, Array<WebSocket>>;

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
	public addUserSocket(userID: string, socket: WebSocket) {
		const sockets: Array<WebSocket> = this.#users.get(userID) || [];
		sockets.push(socket);
		if (this.#users.has(userID) === false) this.#users.set(userID, sockets);
	}

	public deleteUserSocket(userID: string, ws: WebSocket) {
		const sockets: Array<WebSocket> = this.#users.get(userID) || [];
		const index: number = sockets.indexOf(ws);
		if (index !== -1) sockets.splice(index, 1);
		if (sockets.length === 0) this.#users.delete(userID);
	}

	public getUserSockets(userID: string): Array<WebSocket> | undefined {
		return this.#users.get(userID);
	}
}
