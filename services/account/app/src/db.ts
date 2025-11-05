import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
// IMPORT FOR Jest TESTS BUT MAKE PROD DB CONNECTION IMPOSSIBLE
 import * as sqlite3 from 'sqlite3';
// IMPORT FOR PROD BUT MAKES Jest AUTOMATED TESTING CRASH 
// import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DEFAULT_DB_PATH = '/usr/data/account.db';

const dbPath = process.env.DATABASE_PATH || DEFAULT_DB_PATH;

export default fp(async (fastify: FastifyInstance) => {
	try {
		const db = await open({
			filename: dbPath,
			driver: sqlite3.Database
		});

		fastify.log.info(`Successfully connected to database: ${dbPath}`);
		fastify.decorate('dbAccount', db);
	} catch (err) {
		fastify.log.error(`Connection to the SQLite database at ${dbPath} FAILED: ${err}`);
		process.exit(1);
	}
});

