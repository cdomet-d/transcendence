import { Database } from 'sqlite';
import 'fastify';

declare module 'fastify' {
	export interface FastifyInstance {
		dbFriends: Database;
	}

	export interface FastifyRequest {
		user: {
			userID: number;
			username: string;
		};
	}
}