import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

interface Params {
	userID: string;
}

export function notifHandler(
	this: FastifyInstance,
	socket: WebSocket,
	req: FastifyRequest<{ Params: Params }>,
) {
	this.log.info('NOTIF webSocket connection established');
	const authResult = authenticateConnection(this, req, socket);
	if (!authResult) return;
	this.users.addUserSocket(authResult.userID, socket);

	const interval = setInterval(() => {
		if (socket.readyState === socket.OPEN) socket.send(JSON.stringify('ping'));
		else clearInterval(interval);
	}, 30000);

	socket.onclose = (event) => {
		this.users.deleteUserSocket(authResult.userID, socket);
	};

	socket.onerror = (event) => {
		this.log.error(event.message);
		socket.close(1011, event.message);
	};
}

interface JWTPayload {
    userID: string;
    username: string;
}

function authenticateConnection(fastify: FastifyInstance, req: FastifyRequest, socket: WebSocket): { userID: string; username: string } | null {
    try {
        const token = req.cookies?.token || req.cookies?.accessToken;

        if (!token) {
            req.server.log.warn('WebSocket connection attempt without authentication token');
            socket.close(1008, 'Authentication required');
            return null;
        }

        const decoded = fastify.jwt.verify<JWTPayload>(token);
        req.server.log.info(`Authenticated WebSocket connection for user: ${decoded.userID}`);
        
        return { userID: decoded.userID, username: decoded.username };
    } catch (error) {
        req.server.log.warn(`Invalid JWT token in WebSocket connection: ${error}`);
        socket.close(1008, 'Invalid authentication token');
        return null;
    }
}