import type { FastifyInstance } from "fastify";

export async function accountRoutes(serv: FastifyInstance) {


	serv.post('/account/register', async (request, reply) => {
		try {
			//parametres username et hashed password
			//inserer une nouvelle ligne avec un nouvel ID
			//creer un nouveau userProfile
			//creer un nouveau userStats

		} catch (error) {
			console.error('[Friend service] Error accepting friend request', error);
			return (reply.code(500).send({
				success: false,
				message: 'An internal error occured.'
			}));
		}
	
	});
	//register user
	//check password match when connection
	//update password
	// update username BUUUUT we need to match the username in the user table soooooo

	//TODO: where, when and how do we encrypt/hash a password

};