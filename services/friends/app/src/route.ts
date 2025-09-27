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
      const { username: receiverUsername } = request.params as { username: string };
      const { userId: senderId } = request.body as { userId: number };
      
      const receiverId = 52;

      if (!senderId || !receiverUsername) {
        return reply.code(400).send({ message: 'Missing sender ID or receiver username.' });
      }

      // C'est un excellent endroit pour déboguer ce que vous recevez !
      serv.log.info(`Processing friend request from user ${senderId} to ${receiverUsername}`);

      // 2. ICI : La logique métier
      //    - Valider les données du body (sont-elles correctes ?)
      //    - Vérifier si l'utilisateur cible (username) existe
      //    - Insérer la demande d'ami dans votre base de données
      //    - etc.
      //    Exemple : await database.createFriendRequest(body.userId, username);

      const query = `
        INSERT INTO friendship (friendshipID, userID, friendID, startTimeFriendship, statusFrienship)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const params = [
        null, // La BDD gère friendshipID (auto-increment)
        senderId, // L'ID de l'expéditeur (du body)
        receiverId, // L'ID du destinataire (trouvé à l'étape 3.1)
        new Date().toISOString(), // La date actuelle
        false // statut 'pending'
      ];

      await new Promise<void>((resolve, reject) => {
        db.run(query, params, function(err) {
          if (err) {
            serv.log.error(`SQL Error: ${err.message}`);
            // Rejeter la promesse si une erreur SQL se produit
            reject(new Error('Failed to create friend request in database.'));
            return;
          }
          serv.log.info(`A row has been inserted with rowid ${this.lastID}`);
          resolve();
        });
      });

      // 3. On envoie une réponse de succès
      // Le code 201 "Created" est sémantiquement correct pour un POST qui crée une ressource.
      return reply.code(201).send({
        success: true,
        message: `Friend request sent to ${receiverUsername}`
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
