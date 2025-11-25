import type { FastifyInstance } from 'fastify';
import { getGameHistory } from './dashboard.service.js';

export interface Match {
	gameID: number;
	duration: number;
	startTime: string;
	player1: number;
	player2: number;
	player1Score: number;
	player2Score: number;
	opponentID: number;
}

export interface Tournament {
	tournamentID: number;
	winnerID: number;
}

export async function dashboardRoutes(serv: FastifyInstance) {

	/* -------------------------------------------------------------------------- */
	/*                                    GAME                                    */
	/* -------------------------------------------------------------------------- */

	//post a game
	serv.post('/game', async (request, reply) => {
		try {
			const body = request.body as { [key: string]: any };

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
	serv.get('/games/:userID', async (request, reply) => {
		try {
			const { userID } = request.params as { userID: string };
			if (!userID)
				return (reply.code(400).send({ message: '[DASHBOARD] userID query parameter is required.' }));

			const games = await getGameHistory(serv.dbStats, Number(userID));
			return (reply.code(200).send(games));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error fetching match history: ${error}`);
			throw (error);
		}
	});

	//delete a game
	serv.delete('/game/:gameID', async (request, reply) => {
		try {
			const { gameID } = request.params as { gameID: string };

			if (!gameID)
				return (reply.code(400).send({ message: '[DASHBOARD] gameID query parameter is required.' }));

			const query = `
				DELETE FROM game WHERE gameID = ?
			`;

			const response = await serv.dbStats.run(query, [gameID]);
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
	serv.post('/tournament', async (request, reply) => {
		try {

			const body = request.body as { [key: string]: any };

			const validKeys = [
				'tournamentID',
				'nbPlayers',
				'tournamentStatus',
				'winnerID',
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
	serv.patch('/tournament/:tournamentID', async (request, reply) => {
		try {
			const { tournamentID } = request.params as { tournamentID: string };
			const { winnerID } = request.body as { winnerID: number };

			if (winnerID === undefined)
				return (reply.code(400).send({ message: '[DASHBOARD] winnerID is required.' }));

			const query = `UPDATE tournament SET winnerID = ? WHERE tournamentID = ?`;
			const params = [winnerID, tournamentID];

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
	serv.delete('/tournament/:tournamentID', async (request, reply) => {
		try {
			const { tournamentID } = request.params as { tournamentID: number };

			const query = `
				DELETE FROM tournament WHERE tournamentID = ?
			`;

			const response = await serv.dbStats.run(query, [tournamentID]);
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

	//TODO delete a player from a game ? GRPD
}
