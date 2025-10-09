import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { friendRoutes } from './route.js';
import cors from '@fastify/cors';
import dbConnector from "./db.js"

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(dbConnector);
serv.register(friendRoutes);
// 3. Créez une fonction de démarrage `async` pour lancer le serveur proprement.
const start = async () => {
  try {
    // Le serveur ne sera considéré comme "démarré" qu'une fois cette ligne terminée.
    await serv.listen({ port: 1616, host: '0.0.0.0' });
  } catch (err) {
    // Le logger intégré affichera l'erreur de manière détaillée.
    serv.log.error(err);
    process.exit(1);
  }
};

// 4. Appelez la fonction pour démarrer le serveur.
start();
