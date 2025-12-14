import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import type { JWTPayload } from './lobby.interface.js';
import { wsSend } from './wsHandler.gm.js';

export function authenticateConnection(fastify: FastifyInstance, req: FastifyRequest, socket: WebSocket): { userID: string; username: string } | null {
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

export function verifyUserIDMatch(payloadUserID: string | undefined, authenticatedUserID: string, req: FastifyRequest, socket: WebSocket): boolean {
    if (payloadUserID && payloadUserID !== authenticatedUserID) {
        req.server.log.warn(`UserID mismatch: payload=${payloadUserID}, authenticated=${authenticatedUserID}`);
        wsSend(socket, JSON.stringify({ error: 'user mismatch' }));
        socket.close(1008, 'Unauthorized');
        return false;
    }
    return true;
}
