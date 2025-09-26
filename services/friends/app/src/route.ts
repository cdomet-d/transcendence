import type { FastifyInstance } from 'fastify';
import { db } from './db.js';

export async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/api/user/friends-requests/', async (request, reply) => {
    const { requester_id, requestee_id } = request.body as { requester_id: number, requestee_id: number };
	  request.log.info("In the friendRoutes function from friend container");

    if (!requester_id || !requestee_id) {
      reply.code(400).send({ error: 'Missing requester_id or requestee_id' });
      return;
    }

    try {
      await db.run(
    `INSERT INTO friendship (userID, friendID, startTimeFriendship, statusFrienship)
      VALUES (?, ?, datetime('now'), ?)`,
		[requester_id, requestee_id, false]
      );
      reply.send({ status: 'ok', message: 'Friend request saved' });
    } catch (err) {
      reply.code(500).send({ error: 'Could not save friend request' });
    }
  });
}
