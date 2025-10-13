import { Database } from 'sqlite';

declare module 'fastify' {
	export interface FastifyInstance {
		dbStats: Database;
		user : {
			userID : number,
			username : string
		};
	}
}