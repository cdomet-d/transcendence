import { _serv } from './server/server.js';

import jwt from 'jsonwebtoken';
import Fastify from 'fastify'
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cookie from '@fastify/cookie';

export function healthcheck(serv: FastifyInstance) {
	serv.get('/healthcheck', (req, res) => {
		res.send({ message: 'Success' });
	})
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // //
// user routes
export async function userRoutes(serv: FastifyInstance) {
	serv.get('/', (req: FastifyRequest, reply: FastifyReply) => {
		reply.send({ message: '/Sending message to `/`' });
	})
	serv.post('/register',
		schema: {
		body: { $ref: 'createUserSchema#' },
		response: {
			200: { $ref: 'createUserResponseSchema#' },
		},
	},
		() => { });
	serv.post('/login', () => { })
	serv.delete('/logout', () => { })
	serv.log.info('user routes registered')
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // //
// user data needed to register
const registerUserSchema = z.object({
	username: z.string(),
	password: z.string().min(8)
});

//exporting the type to provide to the request Body
export type CreateUserInput = z.infer<typeof registerUserSchema> // response schema for registering user
const registerUserResponseSchema = z.object({
	userID: z.number(),
	username: z.string(),
	role: z.string()
});

// convert zod to json
const createUserJsonSchema = zodToJsonSchema(registerUserSchema, 'createUserSchema');
const createUserResponseJsonSchema = zodToJsonSchema(registerUserResponseSchema, 'createUserResponseSchema');

// // // // // // // // // // // // // // // // // // // // // // // // // // // //
// same for login route
const loginSchema = z.object({
	username: z.string(),
	password: z.string().min(6)
})

export type LoginUserInput = z.infer<typeof loginSchema>
const loginResponseSchema = z.object({
	accessToken: z.string(),
})

// convert zod to json
const loginJsonSchema = zodToJsonSchema(loginSchema, 'loginSchema');
const loginResponseJsonSchema = zodToJsonSchema(loginResponseSchema, 'loginResponseSchema');


// // // // // // // // // // // // // // // // // // // // // // // // // // // //
_serv.addSchema(createUserJsonSchema);
_serv.addSchema(createUserResponseJsonSchema);
_serv.addSchema(loginJsonSchema);
_serv.addSchema(loginResponseJsonSchema);

_serv.post('/register', {
	schema: {
		body: { $ref: 'createUserSchema#' },
		response: {
			200: { $ref: 'createUserResponseSchema#' },
		},
	}
});