import 'fastify';

declare module 'fastify' {
	export interface FastifyRequest {
		user: {
			userID: number;
			username: string;
		};
	}
}