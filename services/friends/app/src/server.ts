import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { options } from './serv.conf.js';

interface Params {
  username: string;
}

try {
	const serv: FastifyInstance = Fastify(options);
	
/* 	serv.post("/api/user/friends-requests/:username", async (
		request: FastifyRequest<{ Params: Params }>,
  		reply: FastifyReply) => {
		const requester = "sam";
		const targetUsername = request.params.username;
		await addFriendRequest(requester, targetUsername);
  		reply.code(201).send({ success: true });
	}); */
	
	serv.listen({ port: 1616, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}
