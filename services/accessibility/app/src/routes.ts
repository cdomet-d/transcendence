import type { FastifyInstance } from 'fastify';

export async function languageRoutes(serv: FastifyInstance) {

	//get a translation from the word you want to translation + the targeted language
	serv.get('/translation', async (request, reply) => {
		const { langCode } = request.query as { langCode: string };

		if (!langCode)
			return (reply.code(400).send({ message: 'Missing target language for translation' }));

		const query = `
			SELECT translation FROM translations WHERE language_code = ?
		`;

		try {
			const response = await serv.dbLanguage.get(query, [langCode]);
			if (response) return reply.code(200).send(response);
			else reply.code(404).send({ message: 'Translation not found' });
		} catch (error) {
			serv.log.error(error);
			throw error;
		}
	});
}
