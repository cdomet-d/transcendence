import { wsHandler } from '../handlers/websocket.js'
import type { FastifyPluginCallback } from 'fastify';

// const opts = {
//     schema: {},
//     wsHandler: wshandler,
// }

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/api/game/menu', { websocket: true }, wsHandler);
    done();
}

export { wsRoute };
