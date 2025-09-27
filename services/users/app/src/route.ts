import type { FastifyInstance } from 'fastify';
import { dbUsers } from './db.js';

export async function userRoutes(serv: FastifyInstance) {
    serv.get('/internal/users/by-username/:username', async (request, reply) => {
        try {
            const { username } = request.params as{ username: string};
            const query = `SELECT userID, username FROM userProfile WHERE username = ?`;

            const user = await new Promise((resolve, reject) => {
                dbUsers.get(query, [username], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
            if (!user) {
                return (reply.code(404).send({message: 'User not found'}));
            }

            return (reply.code(200).send(user));

        } catch (error) {
            serv.log.error(error);
            return (reply.code(500).send({message: 'Internal server error'}));
        }
    });
}