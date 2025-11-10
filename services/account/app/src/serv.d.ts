import { Database } from 'sqlite';
import 'fastify';

declare module 'fastify' {
	export interface FastifyInstance {
		dbAccount: Database;
	}

	export interface FastifyRequest {
		user: {
			userID: number;
			username: string;
		};
	}
}