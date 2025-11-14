import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
// IMPORT FOR Jest TESTS BUT MAKE PROD DB CONNECTION IMPOSSIBLE
// import * as sqlite3 from 'sqlite3';
// IMPORT FOR PROD BUT MAKES Jest AUTOMATED TESTING CRASH 
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DEFAULT_DB_PATH = '/usr/data/account.db';

const dbpath = process.env.DATABASE_PATH || DEFAULT_DB_PATH;

async function dbConnector(fastify: FastifyInstance) {
	try {
		const db = await open ({
			filename: dbpath,
			driver: sqlite3.Database

		});

		fastify.log.info('Connected to the stats.db SQLite database');

		//Attaching db connection to fastify
		fastify.decorate('dbStats', db);
	
	} catch (err) {
		fastify.log.info('Connection to the stats.db SQLite database failed');
		process.exit(1);
	}
}

export default fp(dbConnector);