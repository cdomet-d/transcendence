import Fastify from 'fastify'
import fs from 'fs';
// import WebSocket from 'ws';
// importe la fonction constructeur Fastify depuis le module fastify.
// ici c'est seulement l'objet en lui meme qui est appelé, cad sa référence
// mais la fonction n'est pas executé

const fastify = Fastify({
  logger: true
})
// cette fois la fonction constructeur Fastify est executée grace aux parenthèses
// elle retourne une instance du server fastify (un objet)
// et le configure pour activer le logger pino

fastify.get('/api/game/match', function (request, reply) {
  const stream = fs.createReadStream('app/wsReply.js');
  reply.header('Content-Type', 'application/javascript');
  reply.send(stream);
})

fastify.listen({ port: 2020 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})

// const wsserver = new WebSocket.Server({ port: 2222 });

// wsserver.on('connection', function connection(ws) {
//   console.log('Client connecté');

//   ws.on('message', function incoming(message) {
//     console.log('Reçu du client:', message);
//     ws.send(`Réponse du serveur : ${message}`);
//   });
// });

