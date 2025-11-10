import { Database } from 'sqlite';
import 'fastify';

declare module 'fastify' {
	export interface FastifyInstance {
		dbUsers: Database;
	}

	export interface FastifyRequest {
		user: {
			userID: number;
			username: string;
		};
	}
}