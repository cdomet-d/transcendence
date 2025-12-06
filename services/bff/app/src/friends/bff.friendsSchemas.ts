const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		code: { type: ['string', 'number'], nullable: true }
	}
};

export const relationPost = {
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' },
		},
	},
	response: {
		201: {
			type: 'object',
			properties: {
				message: { type: 'string' },
			},
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse,
		503: messageResponse
	},
};

export const relationPatch = {
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' },
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
			},
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse,
		503: messageResponse
	},
};

export const relationDelete = {
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' },
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
			},
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse,
		503: messageResponse
	},
};

export const relationGet = {
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				body: { type: 'string' },
			},
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	},
};