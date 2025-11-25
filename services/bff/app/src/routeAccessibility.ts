import type { FastifyInstance } from 'fastify';

async function fetchTranslation(word: string, langCode: string): Promise<Response> {
	const url = `http://nginx:443/internal/translations?word=${encodeURIComponent(word)}&langCode=${encodeURIComponent(langCode)}`;
	return (fetch(url));
}

export async function bffAccessibilityRoutes(serv: FastifyInstance) {

	serv.get('/translations', async (request, reply) => {
		try {
			const { word, lang } = request.query as { word: string, lang: string };

			if (!word || !lang)
				return reply.code(400).send({ message: 'Missing required query parameters: word, lang' });

			const translationResponse = await fetchTranslation(word, lang);
			return (reply
				.code(translationResponse.status)
				.send(await translationResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error getting translation: ${error}`);
			return (reply.code(503).send({ message: 'The translation service is currently unavailable.' }));
		}
	});
}