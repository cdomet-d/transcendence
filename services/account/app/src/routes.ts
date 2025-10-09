import type { FastifyInstance } from 'fastify';

export async function accountRoutes(serv: FastifyInstance) {
	serv.post('/account/register', async (request, reply) => {
		try {
			const { username } = request.body as { username: string };
			const { hashedPass } = request.body as { hashedPass: string };

			if (!username || !hashedPass)
				return reply.code(400).send({ message: 'Missing username or hashedPass.' });

			const query = `
				INSERT INTO usersAuth (hashedPassword, username, userStatus, registerDate)
				VALUES (?, ?, 1, ?)
			`;

			const params = [
				hashedPass,
				username,
				new Date().toISOString()
			];
			
			const result = await serv.dbAccount.run(query, params);

			return (reply.code(201).send({
				success: true,
				message: 'Account registered !'
			}));

			} catch (error) {
				serv.log.error(`Error creating user account: ${error}`);
				return reply.code(500).send({ message: 'Internal server error' });
			}
	});
}

