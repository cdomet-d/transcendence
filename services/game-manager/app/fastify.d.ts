import 'fastify';
import type { NatsConnection } from 'nats'

declare module 'fastify' {
    export interface FastifyInstance {
      nc: NatsConnection;
    }
}
