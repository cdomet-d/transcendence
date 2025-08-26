import {upgrade, wshandler} from '../handlers/websocket.js'
import type { FastifyPluginCallback } from 'fastify';

const opts = {
    schema: {}, //TODO: get coralie's json object
    handler: upgrade,
    wsHandler: wshandler,
}

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/game/match', opts);
    done();
}

export { wsRoute };
