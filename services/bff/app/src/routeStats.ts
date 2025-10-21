import type { FastifyInstance } from 'fastify';
import { findUserByUsername } from './bffFriends.service.js';

import { fetchUserStats } from './bffStats.service.js';
import { updateUserStats } from './bffStats.service.js';
import { incrementWinStreak } from './bffStats.service.js';
import { resetWinStreak } from './bffStats.service.js';

export async function bffStatsRoutes(serv: FastifyInstance) {

	//TODO fix that
	serv.get('/api/users/:userID/stats', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const statsResponse = await fetchUserStats(userID);
			return (reply.code(statsResponse.status).send(await statsResponse.json()));

		} catch (error) {
			serv.log.error(`[BFF] Error getting user stats: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.get('/api/account/me/stats', async (request, reply) => {
		try {
			const userID = request.user.userID;

			const statsResponse = await fetchUserStats(userID);

			return reply.code(statsResponse.status).send(await statsResponse.json());

		} catch (error) {
			serv.log.error(`[BFF] Error getting own stats: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});

	serv.post('/api/games/responses', async (request, reply) => {
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

			return reply.code(200).send({ message: 'Game responses processed.' });
		} catch (error) {
			serv.log.error(`[BFF] Error processing game responses: ${error}`);
			return reply.code(503).send({ message: 'A backend service is unavailable.' });
		}
	});
}
