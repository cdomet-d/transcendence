export const auth = {
	body: {
		type: 'object',
		// TODO: password is not required for temporary users
		required: ['username', 'password'],
		properties: {
			username: { type: 'string', minLength: 4, maxLength: 18, pattern: '^[a-zA-Z0-9_-]+$' },
			password: { type: 'string', minLength: 12, maxLength: 64 }
		},
	},
};

export const verify = {
	body: {
		type: 'object',
		required: ['password'],
		properties: {
			password: { type: 'string', maxLength: 64 }
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
			username: { type: 'string', minLength: 4, maxLength: 18, pattern: '^[a-zA-Z0-9_-]+$' },
			password: { type: 'string', minLength: 12, maxLength: 64 }
		},
	},
};
