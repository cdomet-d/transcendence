import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
// IMPORT FOR Jest TESTS BUT MAKE PROD DB CONNECTION IMPOSSIBLE
// import * as sqlite3 from 'sqlite3';
// IMPORT FOR PROD BUT MAKES Jest AUTOMATED TESTING CRASH 
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbpath = '/usr/data/users.db';

async function dbConnector(fastify: FastifyInstance) {
	try {
		const db = await open({
			filename: dbpath,
			driver: sqlite3.Database

		});

		fastify.log.info('Connected to the users.db SQLite database');
		fastify.decorate('dbUsers', db);

	} catch (err) {
		fastify.log.info('Connection to the users.db SQLite database failed');
		process.exit(1);
	}
}

export default fp(dbConnector);
