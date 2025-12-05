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
	},
};

export const relationGet = {
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				// returning a stringified JSON as per your route logic
				body: { type: 'string' },
			},
		},
	},
};