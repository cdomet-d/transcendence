import type { FastifyInstance } from 'fastify';

export async function languageRoutes(serv: FastifyInstance) {
    //get a translation from the word you want to translation + the targeted language
    serv.get('/api/accessibility/', async (request, reply) => {
        console.log('got / in accessibility');
        return reply.code(200).send({ message: 'Server for accessibility reached' });
    });

    serv.get('/api/accessibility/translation', async (request, reply) => {
        const { word, langCode } = request.query as { word: string; langCode: string };

        if (!word || !langCode)
            return reply
                .code(400)
                .send({ message: 'Missing word or target language for translation' });

        const query = `
			SELECT translation FROM translations WHERE word = ? AND language_code = ?
		`;

        try {
            const response = await serv.dbLanguage.get(query, [word, langCode]);
            if (response) return reply.code(200).send(response);
            else reply.code(404).send({ message: 'Translation not found' });
        } catch (error) {
            serv.log.error(error);
            throw error;
        }
    });
}
