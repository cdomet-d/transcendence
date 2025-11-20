import { Database } from 'sqlite';
import 'fastify';

declare module 'fastify' {
	export interface FastifyInstance {
		dbAuth: Database;
	}
}