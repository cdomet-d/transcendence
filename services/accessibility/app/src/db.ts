import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbpath = '/usr/data/language.db';

async function dbConnector(fastify: FastifyInstance) {
	try {
		const db = await open({
			filename: dbpath,
			driver: sqlite3.Database

		});

		fastify.log.info('Connected to the language.db SQLite database');

		//Attaching db connection to fastify
		fastify.decorate('dbLanguage', db);

	} catch (err) {
		fastify.log.info('Connection to the language.db SQLite database failed');
		process.exit(1);
	}
}

export default fp(dbConnector);