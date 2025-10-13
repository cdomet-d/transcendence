import type { FastifyInstance } from 'fastify';

export async function languageRoutes(serv: FastifyInstance) {
	
	//get a translation from the word you want to translation + the targeted language
	serv.get('/internal/accessibility/translation', async (request, reply) => {
		const { word: word} = request.params as { word: string };
		const { langCode: langCode } = request.params as { langCode: string };

		serv.log.info(`Asking for translation for '${word}'`);

		if ( !word || !langCode)
			return (reply.code(400).send({message: 'Missing word or target language for translation'}));

		const query = `
			SELECT translation FROM translations WHERE word = ? AND language_code = ?
		`;

		try {
			const result = await serv.dbLanguage.get(query, [word, langCode]);

			if (result) {
				//Fastify assums a 200 code if data is returned
				reply.send(result);
			} else {
				reply.code(404).send({ message: 'Translation not found' });
			}
		} catch (error) {
			serv.log.error(error);
			reply.code(500).send({ message: 'Database error' });
		}
	});
}