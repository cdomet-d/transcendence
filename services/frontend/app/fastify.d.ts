import type { NatsConnection } from 'nats'

declare module 'fastify' {
    interface FastifyInstance {
      nc: NatsConnection;
    }
}