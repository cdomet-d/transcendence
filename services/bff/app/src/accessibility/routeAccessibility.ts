import type { FastifyInstance } from 'fastify';
import { dictionaryGet } from './bff.accessibilitySchemas.js';
import { cleanInput } from '../utils/sanitizer.js';
import type { JwtPayload } from '../utils/bff.interface.js';

async function fetchLanguagePack(log: any, langCode: string): Promise<Response> {
	const url = `http://accessibility:1313/dictionary/${langCode}`;

	try {
		return await fetch(url);
	} catch (error) {
		log.error(`[BFF] Accessibility service unreachable: ${error}`);
		throw error;
	}
}

export async function bffAccessibilityRoutes(serv: FastifyInstance) {

	serv.get('/dictionary/:lang', { schema: dictionaryGet }, async (request, reply) => {
		try {
			let { lang } = request.params as { lang: string };
			const safeLang = cleanInput(lang);

			if (lang === 'Español')
				lang = "Espanol";

			const response = await fetchLanguagePack(serv.log, lang);

			if (!response.ok) {
				if (response.status === 404)
					throw { code: 404, message: 'Dictionary not found' };
				throw { code: response.status, message: 'Error fetching dictionary' };
			}

			const dictionary = await response.json();
			return reply.code(200).send(dictionary);

		} catch (error) {
			serv.log.error(`[BFF] Error fetching dictionary: ${error}`);
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				if (customError.code === 404)
					return reply.code(404).send({ message: '[BFF] Error fetching dictionary' });
			}
			throw (error);
		}
	});
}