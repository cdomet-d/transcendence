import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginAsync } from 'fastify';

export interface JwtPayload {
    userID: string;
    username: string;
    iat: number;
    exp: number;
}

export const authPlugin: FastifyPluginAsync = async (serv: FastifyInstance) => {
    serv.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
		serv.log.info(request.url);
        const token = request.cookies.token;
        if (!token) return reply.code(401).send({ message: 'Unauthorized' });
        try {
            const user = serv.jwt.verify(token) as JwtPayload;
            if (typeof user !== 'object') throw new Error('Invalid token detected');
            request.user = user;
        } catch (error) {
            if (error instanceof Error && 'code' in error) {
                if (
                    error.code === 'FST_JWT_BAD_REQUEST' ||
                    error.code === 'ERR_ASSERTION' ||
                    error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
                )
                    return reply.code(400).send({ code: error.code, message: error.message });
                return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
            } else {
                return reply.code(401).send({ message: 'Unknown error' });
            }
        }
    });
}
