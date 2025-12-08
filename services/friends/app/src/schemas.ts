const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		code: { type: ['string', 'number'], nullable: true },
		success: { type: 'boolean', nullable: true }
	}
};

export const getFriendshipStatusSchema = {
	querystring: {
		type: 'object',
		required: ['userA', 'userB'],
		properties: {
			userA: { type: 'string' },
			userB: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				status: { type: 'string', enum: ['friend', 'pending', 'stranger'] }
			}
		},
		400: messageResponse,
		401: messageResponse
	}
};

export const getFriendListSchema = {
	querystring: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
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

export const getPendingListSchema = {
	querystring: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
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

export const postRelationSchema = {
	body: {
		type: 'object',
		required: ['senderID', 'friendID'],
		properties: {
			senderID: { type: 'string' },
			friendID: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		201: messageResponse,
		400: messageResponse,
		409: messageResponse,
		401: messageResponse
	}
};

export const patchRelationSchema = {
	body: {
		type: 'object',
		required: ['senderRequestID', 'friendID'],
		properties: {
			senderRequestID: { type: 'string' },
			friendID: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		409: messageResponse,
		401: messageResponse
	}
};

export const deleteRelationSchema = {
	body: {
		type: 'object',
		required: ['removerID', 'friendID'],
		properties: {
			removerID: { type: 'string' },
			friendID: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		204: {
			type: 'null',
			description: 'No Content'
		},
		404: messageResponse,
		401: messageResponse,
		400: messageResponse
	}
};

export const deleteAllRelationsSchema = {
	response: {
		200: messageResponse,
		401: messageResponse,
		400: messageResponse
	}
};