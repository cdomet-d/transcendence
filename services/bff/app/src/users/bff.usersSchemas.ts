const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		code: { type: ['string', 'number'], nullable: true }
	}
};

const usernameParams = {
	type: 'object',
	required: ['username'],
	properties: {
		username: { type: 'string' }
	}
};

export const profileGet = {
	params: usernameParams,
	response: {
		200: {
			type: 'object',
			properties: {
				userData: { type: 'object', additionalProperties: true },
				userStats: { type: 'object', additionalProperties: true },
				friends: { type: 'array', items: { type: 'object', additionalProperties: true } },
				pending: { type: 'array', items: { type: 'object', additionalProperties: true } },
				matches: { type: 'array', items: { type: 'object', additionalProperties: true } }
			}
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	}
};

export const tinyProfileGet = {
	params: usernameParams,
	response: {
		200: {
			type: 'object',
			additionalProperties: true
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	}
};

export const searchGet = {
	querystring: {
		type: 'object',
		properties: {
			name: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: true
			}
		},
		400: messageResponse,
		401: messageResponse
	}
};

export const leaderboardGet = {
	response: {
		200: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: true
			}
		},
		400: messageResponse,
		401: messageResponse
	}
};

export const settingsPatch = {
	body: {
		type: 'object',
		properties: {
			avatar: { type: 'string' },
			biography: { type: 'string' },
			profileColor: { type: 'string' },
			defaultLang: { type: 'string' },
			username: { type: 'string' },
			password: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		401: messageResponse,
		404: messageResponse,
		409: messageResponse
	}
};

export const usernameGet = {
	params: usernameParams,
	response: {
		200: {
			type: 'object',
			properties: {
				response: { type: 'object', additionalProperties: true }
			}
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	}
};