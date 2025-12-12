import { kMaxLength } from "buffer";

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
		winstreak: { type: ['number'] },
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
		404: messageResponse,
		401: messageResponse,
		400: messageResponse
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
		},
		401: messageResponse,
		400: messageResponse
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
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				profiles: {
					type: 'array',
					items: userProfileObject
				}
			}
		},
		401: messageResponse,
		400: messageResponse
	}
};

export const getProfilesByIdsSchema = {
	body: {
		type: 'object',
		required: ['userIDs'],
		properties: {
			userIDs: {
				type: 'array',
				items: { type: ['string'] },
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
		400: messageResponse,
		401: messageResponse,
		404: messageResponse
	}
};

export const getUserByNameSchema = {
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
						userID: { type: ['string'] },
						username: { type: 'string' }
					}
				}
			}
		},
		400: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, code: { type: 'string' } } },
		401: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } },
		404: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } }
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
						userID: { type: ['string'] },
						username: { type: 'string' }
					}
				}
			}
		},
		404: messageResponse,
		400: messageResponse,
		401: messageResponse
	}
};

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
						userID: { type: ['string'] },
						username: { type: 'string' }
					}
				}
			}
		},
		404: messageResponse,
		400: messageResponse,
		401: messageResponse
	}
};

export const getUsernamesByIdsSchema = {
	body: {
		type: 'object',
		properties: {
			userIDs: {
				type: 'array',
				items: { type: 'string' }
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
							userID: { type: 'string' },
							username: { type: 'string' }
						}
					}
				}
			}
		},
		401: messageResponse,
		400: messageResponse

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
		409: messageResponse,
		401: messageResponse
	}
};

export const updateProfileSchema = {
	body: {
		type: 'object',
		properties: {
			username: { type: 'string' },
			avatar: { type: 'string', nullable: true },
			biography: { type: 'string' },
			profileColor: { type: 'string' },
			lang: { type: 'string' },
			status: { anyOf: [{ type: 'number' }, { type: 'boolean' }] },
			lastConnexion: { type: 'string' }
		},
		additionalProperties: false
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		409: messageResponse,
		401: messageResponse,
		403: messageResponse
	}
};

export const deleteProfileSchema = {
	params: {
		type: 'object',
		required: ['userID'],
		properties: {
			userID: { type: ['string'] }
		}
	},
	response: {
		204: { type: 'null' },
		404: messageResponse,
		401: messageResponse,
		400: messageResponse
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
		404: messageResponse,
		401: messageResponse,
		400: messageResponse
	}
};

export const updateStatsSchema = {
	body: {
		type: 'object',
		required: ['player1', 'player2', 'player1Score', 'player2Score'],
		properties: {
			player1: { type: ['string'] },
			player2: { type: ['string'] },
			player1Score: { type: 'number' },
			player2Score: { type: 'number' },
			gameID: { type: 'string' },
			tournamentID: { type: ['string'], nullable: true }
		},
		additionalProperties: true
	},
	response: {
		200: messageResponse,
		400: messageResponse,
		404: messageResponse,
		500: messageResponse,
		401: messageResponse

	}
};

export const anonymizeUserSchema = {
	body: {
		type: 'object',
		additionalProperties: true
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' },
				message: { type: 'string' }
			}
		},
		400: messageResponse,
		401: messageResponse,
		404: messageResponse,
		500: messageResponse
	}
};
