import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

interface Params {
  userID: number;//TODO: change to string
}

export function notifHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest<{ Params: Params }>) {
	this.log.info('NOTIF webSocket connection established');
	const userID: number = req.params.userID;
	this.users.addUser(userID, socket);

    socket.onclose = (event) => {
		this.users.deleteUser(userID);
    }

    socket.onerror = (event) => {
		this.log.error(event.message);
		socket.close(1011, event.message);
	};
}
