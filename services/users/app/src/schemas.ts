const messageResponse = {
	type: 'object',
	properties: {
		success: { type: 'boolean' },
		message: { type: 'string' },
		code: { type: ['string', 'number'], nullable: true }
	}
};

const userProfileObject = {
	type: 'object',
	properties: {
		userID: { type: ['string', 'number'] },
		username: { type: 'string' },
		avatar: { type: ['string', 'null'] },
		biography: { type: 'string' },
		lang: { type: 'string' },
		profileColor: { type: 'string' },
		status: { type: 'boolean' },
		winStreak: { type: ['number'] },
		since: { type: 'string' }
	},
	additionalProperties: true
};

export const getUserProfileSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				userData: userProfileObject
			}
		},
		404: messageResponse
	}
};

export const getLeaderboardSchema = {
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				profiles: {
					type: 'array',
					items: userProfileObject
				}
			}
		}
	}
};

export const searchUsersSchema = {
	querystring: {
		type: 'object',
		properties: {
			name: { type: 'string' }
		}
	},
	response: {
		200: {
			oneOf: [
				{
					type: 'object',
					properties: {
						success: { type: 'boolean' },
						profiles: { type: 'array', items: userProfileObject }
					}
				},
				{
					type: 'array',
					items: userProfileObject
				}
			]
		}
	}
};

export const getProfilesByIdsSchema = {
	body: {
		type: 'object',
		required: ['userIDs'],
		properties: {
			userIDs: {
				type: 'array',
				items: { type: ['number', 'string'] },
				minItems: 1
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' },
				profiles: {
					type: 'array',
					items: userProfileObject
				}
			}
		},
		400: messageResponse
	}
};

export const getUserIDByUsernameSchema = {
	params: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' },
				response: {
					type: 'object',
					properties: {
						userID: { type: ['number', 'string'] },
						username: { type: 'string' }
					}
				}
			}
		},
		404: messageResponse,
		400: messageResponse
	}
};

// Warning: GET requests usually shouldn't have bodies, but this matches your code
export const getUserByUsernameBodySchema = {
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' },
				response: {
					type: 'object',
					properties: {
						userID: { type: ['number', 'string'] },
						username: { type: 'string' }
					}
				}
			}
		},
		404: messageResponse,
		400: messageResponse
	}
};

export const getUsernamesByIdsSchema = {
	body: {
		type: 'object',
		properties: {
			userIDs: {
				type: 'array',
				items: { type: 'number' }
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				usersNames: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							userID: { type: 'number' },
							username: { type: 'string' }
						}
					}
				}
			}
		}
	}
};

export const createProfileSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: { type: 'string' }
		}
	},
	response: {
		201: messageResponse,
		409: messageResponse
	}
};

export const updateProfileSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		// Properties inferred from validStatKeys
		properties: {
			username: { type: 'string' },
			avatar: { type: 'string', nullable: true },
			biography: { type: 'string' },
			profileColor: { type: 'string' },
			lang: { type: 'string' },
			activityStatus: { type: ['number', 'boolean'] }
		},
		additionalProperties: false
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		409: messageResponse
	}
};

export const deleteProfileSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: ['string', 'number'] }
		}
	},
	response: {
		204: { type: 'null' },
		404: messageResponse
	}
};

export const getUserStatsSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				stats: { type: 'object', additionalProperties: true }
			}
		},
		404: messageResponse
	}
};

export const updateStatsSchema = {
	body: {
		type: 'object',
		required: ['player1', 'player2', 'player1Score', 'player2Score'],
		properties: {
			player1: { type: ['string', 'number'] },
			player2: { type: ['string', 'number'] },
			player1Score: { type: 'number' },
			player2Score: { type: 'number' },
			// Allow other game props just in case
			gameID: { type: 'string' },
			tournamentID: { type: ['string', 'number'], nullable: true }
		},
		additionalProperties: true
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		500: messageResponse
	}
};