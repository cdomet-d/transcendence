import type { FastifyInstance } from 'fastify';

export async function dashboardRoutes(serv: FastifyInstance) {


	//post a game
	serv.post('/internal/dashboard/createGame', async (request, reply) => {});
	//post a tournament
	serv.post('/internal/dashboard/createTournament', async (request, reply) => {});
	//patch a winner game
	serv.patch('/internal/dashboard/winnerGame', async (request, reply) => {});
	//patch a winner tournament
	serv.patch('/internal/dashboard/winnerTournament', async (request, reply) => {});
	//delete a game
	serv.delete('/internal/dashboard/deleteGame', async (request, reply) => {});
	//delete a tournamement
	serv.delete('/internal/dashboard/deleteTournament', async (request, reply) => {});
	//patch duration
	serv.patch('/internal/dashboard/durationGame', async (request, reply) => {});
	//patch score
	serv.patch('/internal/dashboard/scoreGame', async (request, reply) => {});
	//patch status
	serv.patch('/internal/dashboard/statusGame', async (request, reply) => {});
	//get all game of a player
	serv.get('/internal/dashboard/playerGame', async (request, reply) => {});
	//get all tournamenet of a player
	serv.get('/internal/dashboard/playerTournament', async (request, reply) => {});
	//get all game of a tournamenent
	serv.get('/internal/dashboard/gameTournament', async (request, reply) => {});
	//get stats of a game
	serv.get('/internal/dashboard/statsGame', async (request, reply) => {});
	
	//delete a player from a game ? GRPD
}
