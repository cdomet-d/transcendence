import { Database } from 'sqlite';

declare module 'fastify' {
  export interface FastifyInstance {
    dbLanguage: Database;
  }
}