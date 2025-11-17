import { Database } from 'sqlite';

declare module 'fastify' {
	export interface FastifyInstance {
		dbStats: Database;
	}
	
	export interface FastifyRequest {
		user: { 
			userID: number;
			username: string;
		};
	}
}