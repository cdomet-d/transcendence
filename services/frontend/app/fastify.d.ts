import type { NatsConnection } from 'nats'
import type { Users } from './src/server/notifications/users-class';

declare module 'fastify' {
    interface FastifyInstance {
      nc: NatsConnection;
      users: Users;
    }
}