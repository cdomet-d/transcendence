import { wshandler } from '../handlers/websocket.js'
import type { FastifyPluginCallback } from 'fastify';

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/api/quickMatch', { websocket: true }, wshandler);
    done();
}

export { wsRoute };
