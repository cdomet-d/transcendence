import { wshandler } from '../handlers/websocket.js'
import type { FastifyPluginCallback } from 'fastify';

// const opts = {
//     schema: {

//     },
// }

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/api/game/match', { websocket: true }, wshandler);
    done();
}

export { wsRoute };
