import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbpath = '/usr/data/stats.db';

async function dbConnector(fastify: FastifyInstance) {
	try {
		const db = await open({
			filename: dbpath,
			driver: sqlite3.Database

		});

		fastify.log.info('Connected to the stats.db SQLite database');
		fastify.decorate('dbUsers', db);

	} catch (err) {
		fastify.log.info('Connection to the stats.db SQLite database failed');
		process.exit(1);
	}
}

export default fp(dbConnector);
