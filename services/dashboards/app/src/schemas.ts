// Shared schema for simple message responses
const messageResponse = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		success: { type: 'boolean', nullable: true }
	}
};

/* -------------------------------------------------------------------------- */
/* GAME                                    */
/* -------------------------------------------------------------------------- */

export const postGameSchema = {
	body: {
		type: 'object',
		// At least one property is required by your logic, but schema usually lists valid props
		properties: {
			gameID: { type: 'string' },
			tournamentID: { type: ['string', 'number'], nullable: true },
			localGame: { type: 'boolean' },
			startTime: { type: ['string', 'number'] }, // timestamp or ISO string
			player1: { type: ['string', 'number'] },
			player2: { type: ['string', 'number'] },
			duration: { type: 'number' },
			player1Score: { type: 'number' },
			player2Score: { type: 'number' }
		},
		additionalProperties: false
	},
	response: {
		201: messageResponse,
		400: messageResponse,
		409: messageResponse
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
				additionalProperties: true // Game object structure from DB
			}
		},
		400: messageResponse
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
		404: messageResponse
	}
};

/* -------------------------------------------------------------------------- */
/* TOURNAMENT                                 */
/* -------------------------------------------------------------------------- */

export const postTournamentSchema = {
	body: {
		type: 'object',
		properties: {
			tournamentID: { type: ['string', 'number'] },
			nbPlayers: { type: 'number' },
			tournamentStatus: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		201: messageResponse,
		400: messageResponse,
		409: messageResponse
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
		404: messageResponse
	}
};

export const deleteTournamentSchema = {
	params: {
		type: 'object',
		required: ['tournamentID'],
		properties: {
			// Code parses it as number, but URL params are strings until coerced
			tournamentID: { type: ['string', 'number'] }
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