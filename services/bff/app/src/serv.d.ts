import 'fastify';

declare module 'fastify' {
	export interface FastifyRequest {
		user: {
			userID: string;
			username: string;
		};
	}
}