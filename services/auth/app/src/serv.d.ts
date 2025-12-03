import { Database } from 'sqlite';
import 'fastify';
import type { UserAuth } from './authentication/auth.interfaces.ts';

declare module 'fastify' {
	export interface FastifyInstance {
		dbAuth: Database;
		user: UserAuth
	}
}