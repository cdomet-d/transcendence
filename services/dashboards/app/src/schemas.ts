// Shared schema for simple message responses
const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		success: { type: 'boolean', nullable: true }
	}
};

/* export const postGameSchema = {
	body: {
		type: 'object',
		properties: {
			gameID: { type: 'string' },
			tournamentID: { type: ['string'], nullable: true },
			localGame: { type: 'boolean' },
			startTime: { type: ['string'] },
			player1: { type: ['string'] },
			player2: { type: ['string'] },
			duration: { type: 'number' },
			player1Score: { type: 'number' },
			player2Score: { type: 'number' }
		},
		additionalProperties: false
	},
	response: {
		201: messageResponse,
		400: messageResponse,
		409: messageResponse,
		401: messageResponse
	}
}; */

export const postGameSchema = {
	body: {
		type: 'object',
		required: ['gameID', 'localGame', 'player1', 'player2', 'duration', 'player1Score', 'player2Score'],
		properties: {
			gameID: { type: 'string' },
			tournamentID: { type: 'string' },
			localGame: { type: 'boolean' },
			startTime: { type: 'string' }, // Could add format: 'date-time'
			player1: { type: 'string' },
			player2: { type: 'string' },

			// [SECURITY] Prevent negative duration
			duration: { type: 'number', minimum: 0 },

			// [SECURITY] Prevent negative scores or integer overflows
			// Modified to allow -1 for disconnects
			player1Score: { type: 'integer', minimum: -1, maximum: 99999 },
			player2Score: { type: 'integer', minimum: -1, maximum: 99999 }
		}
	},
	response: {
		201: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' }
			}
		},
		400: {
			type: 'object',
			properties: {
				message: { type: 'string' }
			}
		},
		409: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' }
			}
		}
	}
};

export const getGamesSchema = {
	params: {
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

export const deleteGameSchema = {
	params: {
		type: 'object',
		required: ['gameID'],
		properties: {
			gameID: { type: 'string' }
		}
	},
	response: {
		204: {
			type: 'null',
			description: 'No Content'
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	}
};

export const postTournamentSchema = {
	body: {
		type: 'object',
		properties: {
			tournamentID: { type: ['string'] },
			nbPlayers: { type: 'number' },
			tournamentStatus: { type: 'string' }
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

export const patchTournamentSchema = {
	params: {
		type: 'object',
		required: ['tournamentID'],
		properties: {
			tournamentID: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		required: ['winnerID'],
		properties: {
			winnerID: { type: 'number' }
		},
		additionalProperties: false
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		401: messageResponse
	}
};

export const deleteTournamentSchema = {
	params: {
		type: 'object',
		required: ['tournamentID'],
		properties: {
			tournamentID: { type: ['string'] }
		}
	},
	response: {
		204: {
			type: 'null',
			description: 'No Content'
		},
		404: messageResponse
	}
};