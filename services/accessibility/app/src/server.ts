import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import dbConnector from "./db.js"
import { languageRoutes } from './routes.js';

const serv: FastifyInstance = Fastify(options);

serv.register(dbConnector);
serv.register(languageRoutes);

serv.get('/ping', async (request, reply) => ({ pong: 'it works!' }));

const start = async () => {
	try {
		serv.listen({ port: 1313, host: '0.0.0.0' });
		serv.log.info(serv.printRoutes())
	} catch (err) {
		serv.log.error(err);
		process.exit(1);
	}
};

start();
