const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		code: { type: ['string', 'number'], nullable: true }
	}
};

export const dictionaryGet = {
	params: {
		type: 'object',
		required: ['lang'],
		properties: {
			lang: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			additionalProperties: true,
			description: 'Returns the dictionary JSON for the requested language'
		},
		404: messageResponse,
		502: messageResponse,
		503: messageResponse,
		401: messageResponse,
		400: messageResponse,
		500: messageResponse
	}
};