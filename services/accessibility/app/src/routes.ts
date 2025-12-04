import type { FastifyInstance } from 'fastify';

export async function languageRoutes(serv: FastifyInstance) {

	serv.get('/dictionary/:langCode', async (request, reply) => {
		const { langCode } = request.params as { langCode: string };

		const query = `SELECT pack_json FROM language_packs WHERE language_code = ?`;

		try {
			const result = await serv.dbLanguage.get<{ pack_json: string }>(query, [langCode]);

			if (!result)
				return reply.code(404).send({ message: 'Language pack not found' });

			const dictionary = JSON.parse(result.pack_json);

			return reply.code(200).send(dictionary);
		} catch (error) {
			serv.log.error(error);
			return reply.code(500).send({ message: 'Internal Server Error' });
		}
	});
}