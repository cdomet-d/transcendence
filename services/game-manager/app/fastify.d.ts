import 'fastify';
import type { NatsConnection } from 'nats'
import { Database } from 'sqlite';

declare module 'fastify' {
  export interface FastifyInstance {
    dbGameManager: Database;
    nc: NatsConnection;
  }
}


