import Fastify from 'fastify'
import fs from 'fs';
// importe la fonction constructeur Fastify depuis le module fastify.
// ici c'est seulement l'objet en lui meme qui est appelé, cad sa référence
// mais la fonction n'est pas executé

const fastify = Fastify({
  logger: true
})
// cette fois la fonction constructeur Fastify est executée grace aux parenthèses
// elle retourne une instance du server fastify (un objet)
// et le configure pour activer le logger pino

fastify.get('/', function (request, reply) {
  const stream = fs.createReadStream('app/wsReply.js');
  reply.header('Content-Type', 'application/javascript');
  reply.send(stream);
})

// Run the server!
fastify.listen({ port: 2020 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
})

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 2020 }); //probleme: peut pas avoir le meme port que le server http fastify

wss.on('connection', function connection(ws) {
  console.log('Client connecté');

  ws.on('message', function incoming(message) {
    console.log('Reçu du client:', message);
    ws.send(`Réponse du serveur : ${message}`);
  });
});
