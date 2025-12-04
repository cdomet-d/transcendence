import { Database } from 'sqlite';
import type { JwtPayload } from './authentication/auth.interfaces.ts';
import 'fastify';

declare module 'fastify' {
    export interface FastifyInstance {
        dbAuth: Database;
    }
    export interface FastifyRequest {
        user: JwtPayload;
    }
}
