export const auth = {
	body: {
		type: 'object',
		// TODO: password is not required for temporary users
		required: ['username', 'password'],
		properties: {
			username: { type: 'string' },
			password: { type: 'string' },
		},
	},
};

export const verify = {
	body: {
		type: 'object',
		required: ['password'],
		properties: {
			password: { type: 'string' },
		},
	},
};

export const regen = {
	headers: {
		type: 'object',
		required: ['authorization'],
		properties: {
			authorization: { type: 'string' },
		},
	},
	body: {
		type: 'object',
		required: ['username', 'userID'],
		properties: {
			username: { type: 'string' },
			userID: { type: 'string' },
		},
	},
};
