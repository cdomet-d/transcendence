import { Database } from 'sqlite';

declare module 'fastify' {
	export interface FastifyInstance {
		dbAccount: Database;
		 user: {
			userID: number;
			username: string;
		};
	}
}
