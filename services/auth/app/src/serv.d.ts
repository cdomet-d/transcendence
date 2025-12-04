import { Database } from 'sqlite';
import 'fastify';
import type { UserAuth } from './authentication/auth.interfaces.ts';
import type { JwtPayload } from './jwtPlugin.ts';

declare module 'fastify' {
	export interface FastifyInstance {
		dbAuth: Database;
		user: JwtPayload;
	}
}