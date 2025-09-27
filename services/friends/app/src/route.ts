import type { FastifyInstance } from 'fastify';
import { db } from './db.js';

/* export async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/api/users/friends-requests/', async (request, reply) => {
    const { requester_id, requestee_id } = request.body as { requester_id: number, requestee_id: number };
	  request.log.info("In the friendRoutes function from friend container");

    if (!requester_id || !requestee_id) {
      reply.code(400).send({ error: 'Missing requester_id or requestee_id' });
      return;
    }

    try {
      await db.run(
    `INSERT INTO friendship (userID, friendID, startTimeFriendship, statusFrienship)
      VALUES (?, ?, datetime('now'), ?)`,
		[requester_id, requestee_id, false]
      );
      reply.send({ status: 'ok', message: 'Friend request saved' });
    } catch (err) {
      reply.code(500).send({ error: 'Could not save friend request' });
    }
  });
} */

// On suppose que cette fonction est importée dans votre server.ts et appelée avec serv.register()
export async function friendRoutes(serv: FastifyInstance) {

  // DÉCLARATION DE VOTRE NOUVELLE ROUTE
  // Elle écoute les requêtes POST sur le chemin /user/friends-requests/:username
  // Le :username est un paramètre dynamique
  serv.post('/user/friends-requests/:username', async (request, reply) => {
    try {
      // 1. On récupère les informations de la requête
      const { username } = request.params as { username: string };
      const body = request.body;

      // C'est un excellent endroit pour déboguer ce que vous recevez !
      console.log(`[Friends Service] Received friend request for username: ${username}`);
      console.log('[Friends Service] Request body:', body);

      // 2. ICI : La logique métier
      //    - Valider les données du body (sont-elles correctes ?)
      //    - Vérifier si l'utilisateur cible (username) existe
      //    - Insérer la demande d'ami dans votre base de données
      //    - etc.
      //    Exemple : await database.createFriendRequest(body.userId, username);

      // 3. On envoie une réponse de succès
      // Le code 201 "Created" est sémantiquement correct pour un POST qui crée une ressource.
      return reply.code(201).send({
        success: true,
        message: `Friend request sent to ${username}`
      });

    } catch (error) {
      // Si quelque chose se passe mal (ex: la base de données est indisponible)
      console.error('[Friends Service] Error processing friend request:', error);
      
      // On envoie une réponse d'erreur claire
      return reply.code(500).send({
        success: false,
        message: 'An internal error occurred.'
      });
    }
  });

  // ... vos autres routes (ex: GET /user/friends, etc.) peuvent être ici
}
