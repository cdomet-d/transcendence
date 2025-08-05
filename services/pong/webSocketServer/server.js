import Fastify from 'fastify'
// importe la fonction constructeur Fastify depuis le module fastify.
// ici c'est seulement l'objet en lui meme qui est appelé, cad sa référence
// mais la fonction n'est pas executé
import fs from 'fs/promises';
import websocket from '@fastify/websocket'
const port = process.env.PORT;
//"node --env-file=.env server.js"

/* creer le server */
function checkProxy(address, hop) {
  if (address === '127.0.0.1'/*adresse nginx*/ || hop === 1)
    return true;
  return false;
}

const options = {
  logger: true,
  https: true,
  trustProxy: checkProxy
  //connectionTimeout
  //forceCloseConnections
  //pluginTimeout
}

const fastifyServer = Fastify(options)
// cette fois la fonction constructeur Fastify est executée grace aux parenthèses
// elle retourne une instance du server fastify (un objet)
// elle prend un argument: un objet 'options'

fastifyServer.register(websocket);

/*creer les routes avec leur handlers, hooks, decorators, plugins*/
const opts = {
  schema: {
    //TODO: get coralie's json object
  },
  websocket: true
}

function handler(socket, rep) {
  fastifyServer.log.info('websocket connexion worked')
}

fastifyServer.get('/game/match', opts, handler)
//lorsque le server recoit une requete GET avec l'url /game/match la fonction handler sera execute

/*lancer le server*/
fastifyServer.listen({ port: port }, catchError)

function catchError(err, address) {
  if (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
  fastifyServer.log.info(`Pong Microservice listening on ${port} at ${address}`);
}
//fonction hoistee avec sa propre portee de this a l'oppose d'une fonction flechee

/*
server steps:
- creer un socket non-blocant, associe a localhost, 
  qui ecoute des demandes de connexion sur des routes specifiques
  et qui suis le protocol https et wss
- creer les routes
- lancer le server (tourne tant qu'il est pas arrete par un ctrl C)
- a chaque evenement sur la socket server: 
  soit accepter le client, soit analyser la requete wss
- pour accepter client: verifier la route, 
  renvoyer un javascript qui sera executer dans le navigateur du client 
  pour faire une demande de connexion en websocket, 
  accepter la requete et maintenir une connexion bidirectionnelle avec le client
*/