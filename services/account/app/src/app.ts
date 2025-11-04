import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { accountRoutes } from './routes.js';
import dbConnector from "./db.js";

// This function BUILDS and configures your server, but does not START it.
export async function buildServer(): Promise<FastifyInstance> {
    const serv: FastifyInstance = fastify({
        logger: true
    });

    // Register all your plugins and routes
    serv.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    });

    serv.register(dbConnector);
    serv.register(accountRoutes);

    // Wait for all plugins (like the DB connector) to be loaded
    await serv.ready();
    
    // Return the ready-to-use server instance
    return serv;
}

