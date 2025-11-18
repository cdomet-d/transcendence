import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

function handler(req: FastifyRequest, res: FastifyReply) {
    console.log('SERVING HTML');
    try {
        res.sendFile('index.html');
    } catch {
        console.log('ERROR');
    }
}

const servRoutes: FastifyPluginCallback = function (serv, options, done) {
    console.log('IN THE DYNAMIC ROUTES');
    serv.get('/*', handler);
    done();
};

export { servRoutes };
