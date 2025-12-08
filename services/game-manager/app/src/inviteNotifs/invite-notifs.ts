import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import type { gameNotif } from "../lobby/lobby.interface.js";

interface Params {
	userID: string;
}

export async function addNotifToDB(serv: FastifyInstance, notif: gameNotif) {
    try {
        const queryNotif: string = `
            INSERT INTO gameInviteNotifs (type, senderUsername, receiverID, lobbyID, gameType)
            VALUES ("GAME_INVITE", ?, ?, ?, ?)
        `;
        const paramsNotif: string[] = Object.keys({} as gameNotif);
        const createNotif = await serv.dbGameManager.run(queryNotif, paramsNotif);
        if (createNotif.changes === 0)
            throw new Error('Database Error: Stats INSERT failed (0 changes).');//TODO: handle
    } catch (error) {
        serv.log.error(`[GAME INVITE]: ${error}`);
    }
}

export function removeNotifFromDB(serv: FastifyInstance, lobbyID: string, userID: string) {

}

export async function sendInviteNotifs(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
        const userID: string = request.params.userID;
        if (userID === undefined) {
            //TODO; reply with error
            return;
        }
        const sql = `
            SELECT * FROM gameInviteNotifs WHERE receiverID = ?
        `;
        const params = [userID];
        const notifs: gameNotif[] = await request.server.dbGameManager.all<gameNotif[]>(sql, params);
        if (notifs.length) {
            console.log("user has no pending game invites");
            return;
        }
        reply.code(200).send(notifs);
    } catch (error) {
        request.server.log.error(`[GAME INVITE] Error checking notifs: ${error}`);
        throw error;
    }
}
