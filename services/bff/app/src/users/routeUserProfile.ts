import type { FastifyInstance } from 'fastify';
import type { JwtPayload } from '../utils/bff.interface.js';
import {
	fetchLeaderboard,
	searchBar,
	buildTinyProfile,
	updateAuthSettings,
	updateUserProfile,
	updateUserProfileUsername,
	refreshJWTForUsernameChange,
	deleteAllFriendship,
	AnonymizeUser,
	AnonymizeAccount,
	fetchFullUserProfile,
} from './bffUserProfile.service.js';
import { cleanInput, isPasswordSafe } from '../utils/sanitizer.js';
import { settingsPatchSchema, profileGet, tinyProfileGet, searchGet, leaderboardGet, usernameGet } from './bff.usersSchemas.js';
import jwt from 'jsonwebtoken';
import fileTypeChecker from 'file-type-checker';
import { Buffer } from 'buffer';

function validateBearerToken(serv: FastifyInstance, authorization?: string): boolean {
	if (!authorization) return false;
	const tok = authorization.replace(/^Bearer\s+/i, '');
	try {
		jwt.verify(tok, process.env.JWT_SECRET!);
		return true;
	} catch (error) {
		if (error instanceof Error) serv.log.error(error.message);
		return false;
	}
}

export async function bffUsersRoutes(serv: FastifyInstance) {
	//get's profile + stats + game + friendslist
	// userID -> userID of requested profile
	// get big profile with username
	//error handled
	serv.get('/profile/:username', { schema: profileGet }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const requesterID = request.user.userID;
			const { username } = request.params as { username: string };
			const safeUsername = cleanInput(username);
			const responseData = await fetchFullUserProfile(serv.log, requesterID, safeUsername, token);
			return reply.code(200).send(responseData);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				if (customError.code === 404) return reply.code(404).send({ message: 'User profile data not found.' });
				if (customError.code === 401) return reply.code(401).send({ message: 'Unauthorized' });
				if (customError.code === 400) return reply.code(400).send({ message: 'Unauthorized' });
			}
			serv.log.error(`[BFF] Error building user profile view: ${error}`);
			throw error;
		}
	});

	serv.get('/data', async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const requesterID = request.user.userID;
			const targetUsername = request.user.username;

			const responseData = await fetchFullUserProfile(serv.log, requesterID, targetUsername, token);

			return reply.code(200).send(responseData);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				if (customError.code === 404) return reply.code(404).send({ message: 'Data not found.' });
				if (customError.code === 401) return reply.code(401).send({ message: 'Unauthorized' });
				if (customError.code === 400) return reply.code(400).send({ message: 'Unauthorized' });
			}
			serv.log.error(`[BFF] Error downloading data: ${error}`);
			throw error;
		}
	});

	//error handled
	serv.get('/tiny-profile/:username', { schema: tinyProfileGet }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { username: targetUsername } = request.params as { username: string };
			const { userID: viewerUserID } = request.user as { userID: string };

			const safeTargetUsername = cleanInput(targetUsername);

			if (!viewerUserID) return reply.code(401).send({ message: 'Unauthorized.' });

			const tinyProfile = await buildTinyProfile(serv.log, viewerUserID, safeTargetUsername, token);

			if (!tinyProfile) return reply.code(404).send({ message: 'User profile data not found.' });

			return reply.code(200).send(tinyProfile);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				if (customError.code === 404) return reply.code(404).send({ message: 'User profile data not found.' });
				if (customError.code === 400) return reply.code(400).send({ message: 'Unauthorized' });
				if (customError.code === 401) return reply.code(401).send({ message: 'Unauthorized' });

				serv.log.error(`[BFF] Error building tiny profile: ${error}`);
				throw error;
			}
		}
	});

	//error handled
	serv.get('/search', { schema: searchGet }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const query = request.query as { name?: string };
			const safeName = cleanInput(query.name || '').trim();
			if (!safeName || safeName.length === 0) return reply.code(200).send([]);
			if (!query.name || query.name.trim() === '') return reply.code(200).send([]);

			const profiles = await searchBar(serv.log, safeName, token);
			return reply.code(200).send(profiles);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };

				if (customError.code === 400) return reply.code(400).send({ message: 'Unauthorized' });
				if (customError.code === 401) return reply.code(401).send({ message: 'Unauthorized' });
			}
			serv.log.error(`[BFF] Error searching users: ${error}`);
			throw error;
		}
	});

	serv.get('/leaderboard', { schema: leaderboardGet }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const leaderboard = await fetchLeaderboard(serv.log, token);
			return reply.code(200).send(leaderboard);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };

				if (customError.code === 400) return reply.code(400).send({ message: 'Unauthorized' });
				if (customError.code === 401) return reply.code(401).send({ message: 'Unauthorized' });
			}
			serv.log.error(`[BFF] Error searching leaderboard: ${error}`);
			throw error;
		}
	});

	serv.patch('/settings', { schema: settingsPatchSchema }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const userID = request.user.userID;
			const body = request.body as any;

			const profileUpdates: any = {};
			const profileUpdatesUsername: any = {};
			const accountUpdates: any = {};

			if (body.avatar) {
				const avatarBuffer = Buffer.from(body.avatar, 'base64');
				const uintArr = new Uint8Array(avatarBuffer);
				if (!fileTypeChecker.validateFileType(uintArr, ['png', 'gif', 'jpeg'])) {
					return reply.code(400).send({
						success: false,
						message: 'z image format. Only PNG, GIF and JPEG/JPG are allowed.',
					});
				}
				profileUpdates.avatar = cleanInput(body.avatar);
			}
			if (body.biography) profileUpdates.biography = cleanInput(body.biography);
			if (body.color) profileUpdates.profileColor = cleanInput(body.color);
			if (body.language) profileUpdates.lang = cleanInput(body.language);

			const updateTasks: Promise<void>[] = [];

			if (body.username || body.password) {
				if (!validateBearerToken(serv, request.headers.authorization)) return reply.code(401).send({ message: 'Unauthorized' });

				if (body.username) profileUpdatesUsername.username = cleanInput(body.username);
				if (body.username) accountUpdates.username = cleanInput(body.username);
				if (isPasswordSafe(body.password)) throw { code: 400, message: '[BFF] Could not change settings.' };
				if (body.password) accountUpdates.password = body.password;

				serv.log.warn(profileUpdatesUsername, accountUpdates);
				if (Object.keys(accountUpdates).length > 0) updateTasks.push(updateAuthSettings(serv.log, userID, accountUpdates, token));
				if (Object.keys(profileUpdatesUsername).length > 0) updateTasks.push(updateUserProfileUsername(serv.log, userID, profileUpdatesUsername, token));
			}

			if (Object.keys(profileUpdates).length > 0) updateTasks.push(updateUserProfile(serv.log, userID, profileUpdates, token));
			if (updateTasks.length === 0) return reply.code(200).send({ message: '[BFF] No settings to update.' });

			try {
				await Promise.all(updateTasks);
				if (accountUpdates.username) {
					await refreshJWTForUsernameChange(request.headers.authorization, request.user.userID, accountUpdates.username, reply);
				}
				return reply.code(200).send({ message: '[BFF] Settings updated successfully.' });
			} catch (error) {
				if (typeof error === 'object' && error !== null && 'code' in error) {
					const customError = error as { code: number; message: string };

					if (customError.code === 409)
						return reply.code(409).send({
							message: customError.message || '[BFF] Conflict error. Username taken',
						});
					if (customError.code === 404)
						return reply.code(404).send({
							message: customError.message || '[BFF] User/account not found.',
						});
					if (customError.code === 400) return reply.code(400).send({ message: customError.message || '[BFF] Bad Request.' });
					if (customError.code === 401) return reply.code(401).send({ message: customError.message || '[BFF] Unauthorized' });
				}
				throw error;
			}
		} catch (error) {
			serv.log.error(`[BFF] Failed to update settings: ${error}`);
			throw error;
		}
	});

	serv.get('/:username', { schema: usernameGet }, async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { username } = request.params as { username: string };
			const safeUsername = cleanInput(username);

			const response = await fetch('http://users:2626/username', {
				method: 'POST',
				headers: {
					Cookie: `token=${token}`,
					'Content-Type': 'application/json',
					body: JSON.stringify(safeUsername),
				},
			});

			if (response.status === 401) {
				console.log('[BFF] Unauthaurized');
				reply.code(401).send({ code: response.status, message: '[BFF] Unauthaurized' });
			}
			if (response.status === 404) {
				console.log('[BFF] User not found');
				reply.code(404).send({ code: response.status, message: '[BFF] User not found' });
			}
			if (response.status === 400) {
				console.log('[BFF] Invalid query');
				reply.code(400).send({ code: response.status, message: '[BFF] Invalid query' });
			}

			reply.code(200).send({ response });
		} catch (error) {
			serv.log.error(`[BFF] Failed to update settings: ${error}`);
			throw error;
		}
	});

	serv.delete('/account', async (request, reply) => {
		try {
			const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthaurized' });

			if (token) {
				try {
					const user = serv.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
					request.user = user;
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'ERR_ASSERTION' || error.code === 'FST_JWT_BAD_COOKIE_REQUEST')
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}
			const userID = request.user.userID;

			try {
				if (!validateBearerToken(serv, request.headers.authorization)) return reply.code(401).send({ message: 'Unauthorized' });
				await AnonymizeUser(serv.log, userID, token);

				try {
					await deleteAllFriendship(serv.log, userID, token);
				} catch (e) {
					serv.log.warn('[BFF] Friends deletion failed, continuing to Auth deletion.');
				}

				await AnonymizeAccount(serv.log, userID, token);

				reply.clearCookie('token');
				return reply.code(200).send({ success: true, message: 'Account deleted' });
			} catch (error) {
				if (typeof error === 'object' && error !== null && 'code' in error) {
					const customError = error as { code: number; message: string };

					if (customError.code === 404)
						return reply.code(404).send({
							message: customError.message || '[BFF] User/account not found.',
						});
					if (customError.code === 400) return reply.code(400).send({ message: customError.message || '[BFF] Bad Request.' });
					if (customError.code === 401) return reply.code(401).send({ message: customError.message || '[BFF] Unauthorized' });
				}
				throw error;
			}
		} catch (error) {
			serv.log.error(`[BFF] Failed to delete account: ${error}`);
			throw error;
		}
	});
}
