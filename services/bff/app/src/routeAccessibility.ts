import type { FastifyInstance } from 'fastify';

async function fetchTranslation(langCode: string): Promise<Response> {
	const url = `http://accessibility:1313/translation?langCode=${encodeURIComponent(langCode)}`;
	return (fetch(url));
}
//TODO make route match between front, bff and accessibility
export async function bffAccessibilityRoutes(serv: FastifyInstance) {

	serv.get('/dictionary/:lang', async (request, reply) => {
		try {
			const { lang } = request.params as { lang: string };

			if (!lang)
				return reply.code(400).send({ message: 'Missing required query parameters: word, lang' });

			const translationResponse = await fetchTranslation(lang);
			return (reply
				.code(translationResponse.status)
				.send(await translationResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error getting translation: ${error}`);
			return (reply.code(503).send({ message: 'The translation service is currently unavailable.' }));
		}
	});
}