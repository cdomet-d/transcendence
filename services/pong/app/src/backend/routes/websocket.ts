import { wshandler } from '../handlers/websocket.js'
import type { FastifyPluginCallback } from 'fastify';

// const opts = {
//     schema: {},
//     wsHandler: wshandler,
// }

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/api/game/match', { websocket: true }, wshandler);
    done();
}

export { wsRoute };
