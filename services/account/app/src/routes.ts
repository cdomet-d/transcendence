import type { FastifyInstance } from "fastify";
import { checkUsernameUnique } from "./account.service.js";
import fp from "fastify-plugin"; 

export async function minimalRoutes(serv: FastifyInstance) {
    serv.get('/test-db', async (request, reply) => {
        try {
            console.log("--- TESTING DB CONNECTION ---");
            if (!serv.dbAccount) {
                console.error("CRITICAL: serv.dbAccount is UNDEFINED!");
                return reply.code(500).send({ error: "dbAccount not decorated." });
            }

            // A very simple query
            const result = await serv.dbAccount.get("SELECT 1 AS test");
            
            console.log("DB Query Result:", result);
            return reply.send({ success: true, data: result });

        } catch (error) {
            console.error("Error in /test-db route:", error);
            return reply.code(500).send({ success: false, error: error});
        }
    });
}

//TODO: check password match when connection
//TODO: update password
//TODO: update username BUUUUT we need to match the username in the user table soooooo


//export default fp(accountRoutes);