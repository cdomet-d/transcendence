import type { FastifyInstance } from 'fastify';
import { getGameHistory } from './dashboard.service.js';
import { start } from 'repl';

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

	//TODO: make it work like the patch to get the info from the body
	//TODO: do we want to keep the start time ??
	//TODO: Should we remove gameStatus since we post only finished games ?
	//post a game
	serv.post('/game', async (request, reply) => {
		try {
			const { local } = request.body as { local: boolean };
			const { tournamentID } = request.body as { tournamentID: number };
			const { gameID } = request.body as { gameID: number };
			const { gameStatus } = request.body as { gameStatus: number };
			const { startTime } = request.body as { startTime: number };
			const { player1 } = request.body as { player1: number };
			const { player2 } = request.body as { player2: number };

			const query = `
				INSERT INTO gameMatchInfo (gameID, gameStatus, tournamentID, localGame, startTime, player1, player2)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`;

			const params = [
				gameID,
				gameStatus,
				tournamentID,
				local,
				startTime,
				player1,
				player2
			];

			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('[DASHBOARD] Game creation query succeeded but did not insert a row.');
				throw (new Error('[DASHBOARD] Internal server error during game creation'))
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game created!'
			}));

		} catch (error) {
			serv.log.error(`[[DASHBOARD] Error creating user account: ${error}`);
			throw (error);
		}
	});

	//patch game stats
	serv.patch('/game/:gameID', async (request, reply) => {
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
				return (reply.code(400).send({ message: '[DASHBOARD] No valid fields provided for update.' }));
			}

			const setClauses = keysToUpdate.map(key => `${key} = ?`).join(', ');
			const params = keysToUpdate.map(key => body[key]);
			params.push(gameID);

			const query = `UPDATE gameMatchInfo SET ${setClauses} WHERE gameID = ?`;

			const response = await serv.dbStats.run(query, params);
			if (response.changes === 0)
				return (reply.code(404).send({ message: '[DASHBOARD] Game not found.' }));

			return (reply.code(200).send({ success: true, message: '[DASHBOARD] Game updated!' }));

		} catch (error) {
			serv.log.error(`[DASHBOARD] Error updating game: ${error}`);
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

	//TODO: Should we remove tournamentStatus since we post only finished tournament ?
	//post a tournament
	serv.post('/tournament', async (request, reply) => {
		try {
			const { tournamentID } = request.body as { tournamentID: number };
			const { nbPlayers } = request.body as { nbPlayers: number };
			const { tournamentStatus } = request.body as { tournamentStatus: number };
			const { winnerID } = request.body as { winnerID: number };
			const { creationTime } = request.body as { creationTime: number };

			const query = `
				INSERT INTO tournamentInfo (tournamentID, nbPlayers, tournamentStatus, winnerID, creationTime)
				VALUES (?, ?, ?, ?, ?)
			`;

			const params = [
				tournamentID,
				nbPlayers,
				tournamentStatus,
				winnerID,
				creationTime
			]

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
			serv.log.error(`[DASHBOARD] Error creating user account: ${error}`);
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

			const query = `UPDATE tournamentInfo SET winnerID = ? WHERE tournamentID = ?`;
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
				DELETE FROM tournamentInfo WHERE tournamentID = ?
			`;

			const response = await serv.dbStats.run(query, [tournamentID]);
			if (!response.changes)
				return (reply.code(404).send({ message: '[DASHBOARD] Tournament not found.' }));
			serv.log.error('[DASHBOARD] Tournament deletion query succeeded but did not delete a row.');

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
