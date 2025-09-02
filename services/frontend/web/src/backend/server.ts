import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url';
import { matchRoute } from './route.pong.js';
import { mainRoute } from './route.main.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

try {
	const serv: FastifyInstance = Fastify({logger: {file: "/app/server.log"}});
	serv.register(fastifyStatic, {
			root: [
				"/app/static/",
				"/app/dist/",
				"/app/dist/images/",
				"/app/dist/backend/",
				"/app/images/"
			],
		})
		.register(matchRoute)
		.register(mainRoute);
	await serv.ready();
	serv.listen({ port: 1212, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

// import http from 'http';

// const server = http.createServer((req, res) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-Type', 'text/plain');
// 	res.end('Web Microservice Listener\nCurrent supported routes:\n \
// 	/user/account\n \
// 	/user/friends\n \
// 	/user/search\n \
// 	/game/tournament\n \
// 	/game/leaderboard\n \
// 	/game/match');
// })

// console.log('Web Microservice listening on 1212')
// server.listen(1212);

