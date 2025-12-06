import type { FastifyInstance } from 'fastify';
import { getGameHistory } from './dashboard.service.js';
import { cleanInput, sanitizeBodyValues } from './sanitizer.js';
import { postGameSchema, getGamesSchema, deleteGameSchema, deleteTournamentSchema, patchTournamentSchema, postTournamentSchema } from './schemas.js';

export interface Match {
	gameID: string;
	duration: number;
	startTime: string;
	player1: string;
	player2: string;
	player1Score: number;
	player2Score: number;
	opponentID: string;
}

export interface Tournament {
	tournamentID: string;
	winnerID: string;
}

export async function dashboardRoutes(serv: FastifyInstance) {

	/* -------------------------------------------------------------------------- */
	/*                                    GAME                                    */
	/* -------------------------------------------------------------------------- */

	//post a game
	serv.post('/game', { schema: postGameSchema }, async (request, reply) => {
		try {
			const rawBody = request.body as { [key: string]: any };
			const body = sanitizeBodyValues(rawBody);

			const validKeys = [
				'gameID',
				'tournamentID',
				'localGame',
				'startTime',
				'player1',
				'player2',
				'duration',
				'player1Score',
				'player2Score'
			];
			const keysToInsert = Object.keys(body).filter(key => validKeys.includes(key));

			if (keysToInsert.length === 0)
				return (reply.code(400).send({ message: '[DASHBOARD] No valid fields provided for update.' }));

			const columns = keysToInsert.join(', ');

			const placeholders = keysToInsert.map(() => '?').join(', ');
			const params = keysToInsert.map(key => body[key]);

			const query = `INSERT INTO game (${columns}) VALUES (${placeholders})`;

			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Game creation query succeeded but did not insert a row.');
				throw new Error('[DASHBOARD] Internal server error during game creation');
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game created!'
			}));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error &&
				((error as { code: string }).code === 'SQLITE_CONSTRAINT' ||
					(error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')) {

				return (reply.code(409).send({
					success: false,
					message: '[DASHBOARD] This game ID already exists.'
				}));
			}
			serv.log.error(`[DASHBOARD] Error fetching creating game: ${error}`);
			throw (error);
		}
	});

	//get all game of a player
	serv.get('/games/:userID', { schema: getGamesSchema }, async (request, reply) => {
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
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthaurized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
			}

			const { userID } = request.params as { userID: string };
			const safeUserID = cleanInput(userID);
			if (!safeUserID)
				return (reply.code(400).send({ message: '[DASHBOARD] userID query parameter is required.' }));

			const games = await getGameHistory(serv.dbStats, safeUserID);
			return (reply.code(200).send(games));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error fetching match history: ${error}`);
			throw (error);
		}
	});

	//delete a game
	serv.delete('/game/:gameID', { schema: deleteGameSchema }, async (request, reply) => {
		try {
			const { gameID } = request.params as { gameID: string };
			const safeGameID = cleanInput(gameID);

			if (!safeGameID)
				return (reply.code(400).send({ message: '[DASHBOARD] gameID query parameter is required.' }));

			const query = `
				DELETE FROM game WHERE gameID = ?
			`;

			const response = await serv.dbStats.run(query, [safeGameID]);
			if (response.changes === 0)
				return (reply.code(404).send({ message: 'Game not found.' }));

			return (reply.code(204).send({
				success: true,
				message: '[DASHBOARD] Game deleted!'
			}));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error deleting game: ${error}`);
			throw (error);
		}
	});

	/* -------------------------------------------------------------------------- */
	/*                                 TOURNAMENT                                 */
	/* -------------------------------------------------------------------------- */

	//post a tournament
	serv.post('/tournament', { schema: postTournamentSchema }, async (request, reply) => {
		try {
			const rawBody = request.body as { [key: string]: any };
			const body = sanitizeBodyValues(rawBody);

			const validKeys = [
				'tournamentID',
				'nbPlayers',
				'tournamentStatus',
			];
			const keysToInsert = Object.keys(body).filter(key => validKeys.includes(key));

			if (keysToInsert.length === 0)
				return (reply.code(400).send({ message: '[DASHBOARD] No valid fields provided for update.' }));

			const columns = keysToInsert.join(', ');

			const placeholders = keysToInsert.map(() => '?').join(', ');
			const params = keysToInsert.map(key => body[key]);

			const query = `INSERT INTO tournament (${columns}) VALUES (${placeholders})`;

			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Tournament creation query succeeded but did not insert a row.');
				throw (new Error('[DASHBOARD] Internal server error during game creation'));
			}

			return (reply.code(201).send({
				success: true,
				message: '[DASHBOARD] Tournament created!'
			}));

		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error &&
				((error as { code: string }).code === 'SQLITE_CONSTRAINT' ||
					(error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE')) {

				return (reply.code(409).send({
					success: false,
					message: '[DASHBOARD] This tournament ID already exists.'
				}));
			}
			serv.log.error(`[DASHBOARD] Error creating tournament: ${error}`);
			throw (error);
		}
	});

	//patch a tournament stats
	serv.patch('/tournament/:tournamentID', { schema: patchTournamentSchema }, async (request, reply) => {
		try {
			const { tournamentID } = request.params as { tournamentID: string };
			const { winnerID } = request.body as { winnerID: string };

			const safeTournamentID = cleanInput(tournamentID);
			const safeWinnerID = cleanInput(winnerID);;
			
			if (safeWinnerID === undefined || safeWinnerID === null)
			return (reply.code(400).send({ message: '[DASHBOARD] winnerID is required.' }));

			const query = `UPDATE tournament SET winnerID = ? WHERE tournamentID = ?`;
			const params = [safeWinnerID, safeTournamentID];

			const response = await serv.dbStats.run(query, params);
			if (response.changes === 0)
				return (reply.code(404).send({ message: '[DASHBOARD] Tournament not found.' }));

			return (reply.code(200).send({ success: true, message: '[DASHBOARD] Tournament updated!' }));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error updating tournament: ${error}`);
			throw (error);
		}
	});

	//delete a tournamement
	serv.delete('/tournament/:tournamentID', { schema: deleteTournamentSchema }, async (request, reply) => {
		try {
			const { tournamentID } = request.params as { tournamentID: string };
			const safeTournamentID = cleanInput(tournamentID);

			const query = `
				DELETE FROM tournament WHERE tournamentID = ?
			`;

			const response = await serv.dbStats.run(query, [safeTournamentID]);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Tournament deletion query succeeded but did not delete a row.');
				return (reply.code(404).send({ message: '[DASHBOARD] Tournament not found.' }));
			}

			return (reply.code(204).send());

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error deleted tournament: ${error}`);
			throw (error);
		}
	});
}
