import type { FastifyInstance } from 'fastify';
import { db } from './db.js'; // Adjust if your export/import differs

export async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/api/friend-request', async (request, reply) => {
    const { requester_id, requestee_id } = request.body as { requester_id: number, requestee_id: number };
	console.log("In the friendRoutes function from friend container");

    if (!requester_id || !requestee_id) {
      reply.code(400).send({ error: 'Missing requester_id or requestee_id' });
      return;
    }

    try {
      await db.run(
        `INSERT INTO friendship (userID, friendID, startTimeFriendship, statusFrienship)
        ake ruVALUES (?, ?, datetime('now'), ?)`,
		[requester_id, requestee_id, false]
      );
      reply.send({ status: 'ok', message: 'Friend request saved' });
    } catch (err) {
      reply.code(500).send({ error: 'Could not save friend request' });
    }
  });
}
