import type { FastifyInstance } from 'fastify';
import { findUserByUsername } from './gatewayFriends.service.js';

import { fetchUserStats } from './gatewayUser.service.js';
import { updateUserStats } from './gatewayUser.service.js';
import { incrementWinStreak } from './gatewayUser.service.js';
import { resetWinStreak } from './gatewayUser.service.js';

export async function gatewayStatsRoutes(serv: FastifyInstance) {

	serv.get('/api/users/:username/stats', async (request, reply) => {
		try {
			const { username } = request.params as { username: string };

			const user = await findUserByUsername(username);
			if (!user)
				return reply.code(404).send({ message: `User '${username}' not found.` });

			const statsResponse = await fetchUserStats(user.userID);

			return reply.code(statsResponse.status).send(await statsResponse.json());

		} catch (error) {
			serv.log.error(`[API Gateway] Error getting user stats: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.get('/api/account/me/stats', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const statsResponse = await fetchUserStats(userID);

			return reply.code(statsResponse.status).send(await statsResponse.json());

		} catch (error) {
			serv.log.error(`[API Gateway] Error getting own stats: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.post('/api/games/results', async (request, reply) => {
		try {
			const { winnerID, loserID, duration, winnerScore } = request.body as any;

			const winnerActions = [
				{ action: 'increment', field: 'totalMatch', value: 1 },
				{ action: 'increment', field: 'totalWins', value: 1 },
				{ action: 'setIfGreater', field: 'longestMatch', value: duration },
				{ action: 'setIfLess', field: 'shortestMatch', value: duration },
				{ action: 'setIfGreater', field: 'highestScore', value: winnerScore }
			];

			const loserActions = [
				{ action: 'increment', field: 'totalMatch', value: 1 },
				{ action: 'setIfGreater', field: 'longestMatch', value: duration },
				{ action: 'setIfLess', field: 'shortestMatch', value: duration }
			];

			await Promise.all([
				updateUserStats(winnerID, winnerActions),
				incrementWinStreak(winnerID),

				updateUserStats(loserID, loserActions),
				resetWinStreak(loserID)
			]);

			return reply.code(200).send({ message: 'Game results processed.' });
		} catch (error) {
			serv.log.error(`[API Gateway] Error processing game results: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});
}
