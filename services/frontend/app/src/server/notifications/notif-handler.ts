import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

export function notifHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest) {
	this.log.info('NOTIF webSocket connection established');

    socket.onclose = (event) => {

    }

    socket.onerror = (event) => {
		this.log.error(event.message);
		socket.close(1011, event.message);
	};
}
