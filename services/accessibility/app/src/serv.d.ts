import { Database } from 'sqlite';

// This tells TypeScript we are modifying the 'fastify' module
declare module 'fastify' {
  // We are adding a new property to the FastifyInstance interface
  export interface FastifyInstance {
    dbLanguage: Database;
  }
}