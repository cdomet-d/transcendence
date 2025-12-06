const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' }
	}
};

export const getDictionarySchema = {
	params: {
		type: 'object',
		required: ['langCode'],
		properties: {
			langCode: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			additionalProperties: true,
			description: 'The language pack dictionary object'
		},
		404: messageResponse,
		500: messageResponse
	}
};