import Fastify from 'fastify'
// importe la fonction constructeur Fastify depuis le module fastify.
// ici c'est seulement l'objet en lui meme qui est appelé, cad sa référence
// mais la fonction n'est pas executé

const fastify = Fastify({
  logger: true
})
// cette fois la fonction constructeur Fastify est executée grace aux parenthèses
// elle retourne une instance du server fastify (un objet)
// et le configure pour activer le logger pino

