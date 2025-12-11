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
			const { lang } = request.params as { lang: string };

			const langMap: Record<string, string> = {
				'English': 'English',
				'Français': 'Français',
				'French': 'Francais',
				'Español': 'Espanol',
				'Espanol': 'Espanol',
				'en': 'English',
				'fr': 'Francais',
				'es': 'Espanol'
			};

			const safeInput = cleanInput(lang);

			const targetCode = langMap[lang] || langMap[safeInput] || safeInput;

			const response = await fetchLanguagePack(serv.log, targetCode);

			if (!response.ok) {
				if (response.status === 404)
					throw { code: 404, message: 'Dictionary not found' };

				throw { code: response.status, message: 'Error fetching dictionary from service' };
			}

			const dictionary = await response.json();
			return reply.code(200).send(dictionary);

		} catch (error) {
			serv.log.error(`[BFF] Error fetching dictionary: ${JSON.stringify(error)}`);

			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				return reply.code(customError.code as any).send({ message: customError.message });
			}
			throw(error)
		}
	});
}