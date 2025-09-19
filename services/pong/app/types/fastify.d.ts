import 'fastify';
import { GameRegistry } from '../src/classes/gameRegistry.class.js';

declare module 'fastify' {
  interface FastifyInstance {
    gameRegistry: GameRegistry;
  }
}
