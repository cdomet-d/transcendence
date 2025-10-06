import type { FastifyInstance } from "fastify";
import { checkUsernameUnique } from "./account.service.js";
import fp from "fastify-plugin"; 

export async function accountRoutes(serv: FastifyInstance) {

	serv.post('/account/register', async (request, reply) => {
		try {
			const { username, hashedPass } = request.body as { username: string, hashedPass: string };
			const query = `
				SELECT username FROM usersAuth WHERE username = ? 
				`
			const result = await serv.dbAccount.all(query, username);
//
//			//const usernameAvailable = await checkUsernameUnique(serv.dbAccount, username);
//			//if (usernameAvailable) {
//			//	return reply.code(409).send({
//			//		success: false,
//			//		message: 'This username is already taken'
//			//	});
//			//}
//
//			const queryCreateAccount = `
//				INSERT INTO usersAuth (hashedPassword, username, userStatus, registerDate) VALUES (?, ?, 1, ?)
//				`
//
//			const paramsCreateAccount = [
//				hashedPass,
//				username,
//				new Date().toISOString(),
//			];
//
//			const result  = await serv.dbAccount.run(queryCreateAccount, paramsCreateAccount);
//			if (result.changes === 0) {
//				// This would indicate a problem, as we expect one row to be inserted.
//				return reply.code(500).send({
//					success: false,
//					message: 'Failed to create account in database. here'
//				});
//			}
//			
//			//TODO : add result check 
//			const queryGetID = `
//				SELECT userID FROM usersAuth WHERE username = ?
//			`
//
//			const userID = await serv.dbAccount.get(queryGetID, username);
//			if (!userID) {
//				return reply.code(404).send({
//					success: false,
//					message: 'User not found'
//				});
//			}
//			
//			const responseGetID = await fetch(`http://users:2626/internal/users/createProfile/:userID/${userID}`);
//			if (!responseGetID) {
//					return reply.code(404).send({
//					success: false,
//					message: 'Could not created user profile'
//				});
//			}
//
//			return (reply.code(201).send({
//				success: true,
//				message: `Account created !`
//			}));

		} catch (error) {
			console.error('Error accepting creating account', error);
			return (reply.code(500).send({
				success: false,
				message: 'An internal error occured.'
			}));
		}
	
	});
	//TODO: check password match when connection
	//TODO: update password
	//TODO: update username BUUUUT we need to match the username in the user table soooooo

};

export default fp(accountRoutes);