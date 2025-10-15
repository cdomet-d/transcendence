import { Database } from 'sqlite';
import 'fastify';

declare module 'fastify' {
	 export interface FastifyInstance {
		user: {
			userID: number;
			username: string;
		};
	}
	 export interface FastifyInstance {
		dbFriends: Database;
	}
}