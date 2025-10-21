import type { FastifyInstance } from 'fastify';
import { getGame } from './dashboard.service.js';
import { getGameHistory } from './dashboard.service.js';

interface Match {
	gameID: number;
	duration: number;
	startTime: string;
	winnerID: number;
	loserID: number;
	scoreWinner: number;
	scoreLoser: number;
	opponentID: number;
}

export async function dashboardRoutes(serv: FastifyInstance) {
	//post a game
	serv.post('/internal/dashboard/createGame', async (request, reply) => {
		try {
			const { local } = request.body as { local: boolean};
			const { tournamentID } = request.body as { tournamentID: number};

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
				serv.log.error('Game creation query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game creation' }));
			}

			return (reply.code(201).send({
				success: true,
				gameID: response.lastID,
				message: 'Game created!'
			}));

		} catch (error) {
			serv.log.error(`Error creating user account: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//post a tournament
	serv.post('/internal/dashboard/createTournament', async (request, reply) => {
		try {
			const { playerIDs } = request.body as { playerIDs: number[]};

			if (!Array.isArray(playerIDs) || playerIDs.length === 0 || !playerIDs.every(id => typeof id === 'number'))
				return reply.code(400).send({ message: 'Validation error: playerIDs must be a non-empty array of numbers.' });

			const playerIDsString = JSON.stringify(playerIDs);

			const query = `
				INSERT INTO tournamentInfo (playersIDs) VALUES (?)
			`;

			const response = await serv.dbStats.run(query, [playerIDsString]);
			if (!response.changes) {
				serv.log.error('Tournament creation query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game creation' }));
			}

			return (reply.code(201).send({
				success: true,
				tournamentID: response.lastID,
				message: 'Tournament created!'
			}));

		} catch (error) {
			serv.log.error(`Error creating user account: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//patch a winner game
	serv.patch('/internal/dashboard/winnerGame', async (request, reply) => {
		try {
			const { gameID } = request.body as { gameID: number };
			const { winnerID } = request.body as { winnerID: number };

			const query = `
				UPDATE gameMatchInfo SET winnerID = ? WHERE gameID = ?
			`;

			const params = [
				winnerID,
				gameID
			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Game winner insertion query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game winner update' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game winner updated!'
			}));

		} catch (error) {
			serv.log.error(`Error updating game winner: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//patch a winner tournament
	serv.patch('/internal/dashboard/winnerTournament', async (request, reply) => {
		try {
			const { tournamentID } = request.body as { tournamentID: number };
			const { winnerID } = request.body as { winnerID: number };


			const query = `
				UPDATE tournamentInfo SET winnerID = ? WHERE tournamentID = ?
			`;

			const params = [
				winnerID,
				tournamentID
			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Tournament winner insertion query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during tournament winner update'}));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Tournament winner updated!'
			}));

		} catch (error) {
			serv.log.error(`Error updating tournament winner: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//delete a game
	serv.delete('/internal/dashboard/deleteGame', async (request, reply) => {
		try {
			const { gameID } = request.body as { gameID: number };

			const query = `
				DELETE FROM gameMatchInfo WHERE gameID = ?
			`;

			const response = await serv.dbStats.run(query, [gameID]);
			if (!response.changes) {
				serv.log.error('Game deletion query succeeded but did not delete a row.');
				return (reply.code(500).send({ message: 'Internal server error during game deletion' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game deleted!'
			}));

		} catch (error) {
			serv.log.error(`Error deleting game: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//delete a tournamement
	serv.delete('/internal/dashboard/deleteTournament', async (request, reply) => {
		try {
			const { tournamentID } = request.body as { tournamentID: number };

			const query = `
				DELETE FROM tournamentInfo WHERE tournamentID = ?
			`;

			const response = await serv.dbStats.run(query, [tournamentID]);
			if (!response.changes) {
				serv.log.error('Tournament deletion query succeeded but did not delete a row.');
				return (reply.code(500).send({ message: 'Internal server error during tournament deletion' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Tournament deleted!'
			}));

		} catch (error) {
			serv.log.error(`Error deleted tournament: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//patch duration
	serv.patch('/internal/dashboard/durationGame', async (request, reply) => {
		try {
			const { gameID } = request.body as { gameID: number};
			const { duration } = request.body as { duration: string};

			const query = `
				UPDATE gameMatchInfo SET duration = ? WHERE gameID = ? 
			`;

			const params = [
				duration,
				gameID
			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Game duration update query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game duration update' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game duration updated!'
			}));

		} catch (error) {
			serv.log.error(`Error updating game duration: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//patch score
	serv.patch('/internal/dashboard/scoreGame', async (request, reply) => {
		try {
			const { gameID } = request.body as { gameID: number};
			const { scoreWinner } = request.body as { scoreWinner: number};
			const { scoreLoser } = request.body as { scoreLoser: number};

			const query = `
				UPDATE gameMatchInfo SET scoreWinner = ? AND scoreLoser = ? WHERE gameID = ?
			`;

			const params = [
				scoreWinner,
				scoreLoser,
				gameID
			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Score update query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during score update' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Score updated!'
			}));

		} catch (error) {
			serv.log.error(`Error updating score: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//patch status
	serv.patch('/internal/dashboard/gameStatus', async (request, reply) => {
		try {
			const { gameID } = request.body as { gameID: number};
			const { gameStatus } = request.body as { gameStatus: number};


			const query = `
				UPDATE gameMatchInfo SET gameStatus = ? WHERE gameID = ?
			`;

			const params = [
				gameStatus,
				gameID
			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Game status query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game status update' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Game status updated!'
			}));

		} catch (error) {
			serv.log.error(`Error updating game status: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}});

	//get all game of a player
	serv.get('/internal/dashboard/gameHistory', async (request, reply) => {
/* 	try {
		const userID = request.user.userID;

		const games = await getGameHistory(serv.dbStats, userID);

		if (games.length === 0)
			return (reply.code(200).send([]));

		const gameCardPromises = games.map(async (game) => {
			try {
				const opponentProfile = await fetch(`https://2626/internal/users/by-userID${game.opponentID}`);
				if (!opponentProfile)
					return (null);

				return {
					gameID: game.gameID,
					startTime: game.startTime,
					duration: game.duration,
					userScore: game.winnerID === userID ? game.scoreWinner : game.scoreLoser,
					opponentScore: game.winnerID === userID ? game.scoreLoser : game.scoreWinner,
					isWin: game.winnerID === userID,
					opponent: {
				        username: opponentProfile.username,
				        avatar: opponentProfile.avatar,
				        rank: opponentProfile.rank
				    }
				};
            } catch (error) {
                console.error(`Failed to fetch profile for opponent ${game.opponentID}:`, error);
                return null; // Return null on error so it gets filtered out
            }
        });

        const gameCards = (await Promise.all(gameCardPromises))
                          .filter(card => card !== null);

        return reply.code(200).send(gameCards);

    } catch (error) {
        serv.log.error(`[Stats Service] Error fetching match history: ${error}`);
        return reply.code(500).send({ message: 'An internal error occurred.' });
    } */
});

	//get all tournamenet of a player
	serv.get('/internal/dashboard/playerTournaments', async (request, reply) => {
		try {
			const { userID } = request.body as { userID: number}
			

			const query =
			`
			`;

			const params = [

			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Tournament creation query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game creation' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Tournament created!'
			}));

		} catch (error) {
			serv.log.error(`Error creating user account: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//get all game of a tournamenent
	serv.get('/internal/dashboard/gameTournament', async (request, reply) => {
		try {
			const {}

			const query =
			`
			`;

			const params = [

			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Tournament creation query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game creation' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Tournament created!'
			}));

		} catch (error) {
			serv.log.error(`Error creating user account: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});

	//get stats of a game
	serv.get('/internal/dashboard/statsGame', async (request, reply) => {
		try {
			

			const query = `
			`;

			const params = [

			];
			
			const response = await serv.dbStats.run(query, params);
			if (!response.changes) {
				serv.log.error('Tournament creation query succeeded but did not insert a row.');
				return (reply.code(500).send({ message: 'Internal server error during game creation' }));
			}

			return (reply.code(201).send({
				success: true,
				message: 'Tournament created!'
			}));

		} catch (error) {
			serv.log.error(`Error creating user account: ${error}`);
			return (reply.code(500).send({ message: 'Internal server error' }));
		}
	});


	//get a game with it's ID
	//get a tournament with it's ID
	//delete a player from a game ? GRPD
}
