import 'fastify';
import { GameRegistry } from '../src/classes/gameRegistry.class.js';
import type { NatsConnection } from 'nats'

declare module 'fastify' {
    interface FastifyInstance {
      gameRegistry: GameRegistry;
      nc: NatsConnection;
    }
}
