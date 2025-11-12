import type { FastifyInstance } from 'fastify';
import { getGameHistory } from './dashboard.service.js';
import { getTournamentHistory } from './dashboard.service.js';

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
	serv.post('/internal/dashboard/games', async (request, reply) => {
		try {
			const { local } = request.body as { local: boolean };
			const { tournamentID } = request.body as { tournamentID: number };

			const query = `
				INSERT INTO gameMatchInfo (gameStatus, tournamentID, localGame)
				VALUES (0, ?, ?)
			`;
			const params = [
				tournamentID,
				local
			];

			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Game creation query succeeded but did not insert a row.');
				throw(new Error('[DASHBOARD] Internal server error during game creation'))
			}

			return (reply.code(201).send({
				success: true,
				gameID: response.lastID,
				message: 'Game created!'
			}));

		} catch (error) {
			serv.log.error(`[[DASHBOARD] Error creating user account: ${error}`);
			throw (error);
		}
	});

	//patch game stats
	serv.patch('/internal/dashboard/games/:gameID', async (request, reply) => {
		try {
			const { gameID } = request.params as { gameID: string };
			const body = request.body as { [key: string]: any };

			const validKeys = [
				'duration',
				'player1Score',
				'player2Score',
				'gameStatus'
			];
			const keysToUpdate = Object.keys(body).filter(key => validKeys.includes(key));

			if (keysToUpdate.length === 0) {
				return (reply.code(400).send({ message: 'No valid fields provided for update.' }));
			}

			const setClauses = keysToUpdate.map(key => `${key} = ?`).join(', ');
			const params = keysToUpdate.map(key => body[key]);
			params.push(gameID);

			const query = `UPDATE gameMatchInfo SET ${setClauses} WHERE gameID = ?`;

			const response = await serv.dbStats.run(query, params);
			if (response.changes === 0)
				return (reply.code(404).send({ message: 'Game not found.' }));

			return (reply.code(200).send({ success: true, message: 'Game updated!' }));

		} catch (error) {
			serv.log.error(`[GAMES] Error updating game: ${error}`);
			throw (error);
		}
	});

	//get all game of a player
	serv.get('/internal/dashboard/games', async (request, reply) => {
		try {
			const { userID } = request.query as { userID?: string };
			if (!userID)
				return (reply.code(400).send({ message: 'userID query parameter is required.' }));

			const games = await getGameHistory(serv.dbStats, Number(userID));
			return (reply.code(200).send(games));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error fetching match history: ${error}`);
			throw (error);
		}
	});

	//delete a game
	serv.delete('/internal/dashboard/games/:gameID', async (request, reply) => {
		try {
			const { gameID } = request.params as { gameID: string };

			//Should I add a 400 if gameID not provided ?

			const query = `
				DELETE FROM gameMatchInfo WHERE gameID = ?
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
	serv.post('/internal/dashboard/tournaments', async (request, reply) => {
		try {
			const { playerIDs } = request.body as { playerIDs: number[] };

			if (!Array.isArray(playerIDs) || playerIDs.length === 0 || !playerIDs.every(id => typeof id === 'number'))
				return reply.code(400).send({ message: '[DASHBOARD] Validation error: playerIDs must be a non-empty array of numbers.' });

			const playerIDsString = JSON.stringify(playerIDs);

			const query = `
				INSERT INTO tournamentInfo (playersIDs) VALUES (?)
			`;

			const response = await serv.dbStats.run(query, [playerIDsString]);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Tournament creation query succeeded but did not insert a row.');
				throw(new Error('[DASHBOARD] Internal server error during game creation');)
			}

			return (reply.code(201).send({
				success: true,
				tournamentID: response.lastID,
				message: '[DASHBOARD] Tournament created!'
			}));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error creating user account: ${error}`);
			throw (error);
		}
	});

	//patch a tournament stats
	serv.patch('/internal/dashboard/tournaments/:tournamentID', async (request, reply) => {
		try {
			const { tournamentID } = request.params as { tournamentID: string };
			const { winnerID } = request.body as { winnerID: number };

			if (winnerID === undefined)
				return (reply.code(400).send({ message: 'winnerID is required.' }));

			const query = `UPDATE tournamentInfo SET winnerID = ? WHERE tournamentID = ?`;
			const params = [winnerID, tournamentID];

			const response = await serv.dbStats.run(query, params);
			if (response.changes === 0)
				return (reply.code(404).send({ message: 'Tournament not found.' }));

			return (reply.code(200).send({ success: true, message: 'Tournament updated!' }));

		} catch (error) {
			serv.log.error(`[TOURNAMENTS] Error updating tournament: ${error}`);
			throw (error);
		}
	});

	//delete a tournamement
	serv.delete('/internal/dashboard/tournaments/:tournamentID', async (request, reply) => {
		try {
			const { tournamentID } = request.body as { tournamentID: number };

			const query = `
				DELETE FROM tournamentInfo WHERE tournamentID = ?
			`;

			const response = await serv.dbStats.run(query, [tournamentID]);
			if (!response.changes)
				return (reply.code(404).send({ message: 'Tournament not found.' }));serv.log.error('[DASHBOARD] Tournament deletion query succeeded but did not delete a row.');

			return (reply.code(204).send({
				success: true,
				message: '[DASHBOARD] Tournament deleted!'
			}));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error deleted tournament: ${error}`);
			throw (error);
		}
	});

	//TODO delete a player from a game ? GRPD
}
