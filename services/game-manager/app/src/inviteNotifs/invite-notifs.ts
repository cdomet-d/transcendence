import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import type { gameNotif } from "../lobby/lobby.interface.js";

interface Params {
	userID: string;
}

interface JwtPayload {
	userID: string;
	username: string;
	iat: number;
	exp: number;
}

export async function addNotifToDB(serv: FastifyInstance, notif: gameNotif) {
    try {
        const queryNotif: string = `
            INSERT INTO gameInviteNotifs (type, senderUsername, receiverID, lobbyID, gameType)
            VALUES ("GAME_INVITE", ?, ?, ?, ?)
        `;
        const paramsNotif: string[] = [
            notif.senderUsername,
            notif.receiverID,
            notif.lobbyID,
            notif.gameType
        ];
        const createNotif = await serv.dbGameManager.run(queryNotif, paramsNotif);
        if (createNotif.changes === 0)
            throw new Error('Database Error: Notif INSERT failed (0 changes).');
    } catch (error) {
        serv.log.error(`[GAME INVITE]: ${error}`);
    }
}

export async function removeNotifFromDB(serv: FastifyInstance, lobbyID: string, userID: string) {
    try {
        const query: string = `
            DELETE FROM gameInviteNotifs
            WHERE receiverID = ?
                AND lobbyID = ?;
        `
        const deleteNotif = await serv.dbGameManager.run(query, [userID, lobbyID]);
        if (deleteNotif.changes === 0)
            throw new Error('Database Error: Notif DELETE failed (0 changes).');
    }
    catch (error) {
        serv.log.error(`[GAME INVITE]: ${error}`);
    }
}

export async function sendInviteNotifs(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
        const userID: string = request.params.userID;
        if (!userID)
            return reply.code(400).send({ error: "Missing userID" });
        const token = request.cookies.token;
			if (!token) return reply.code(401).send({ message: 'Unauthorized' });

			if (token) {
				try {
					const user = request.server.jwt.verify(token) as JwtPayload;
					if (typeof user !== 'object') throw new Error('Invalid token detected');
				} catch (error) {
					if (error instanceof Error && 'code' in error) {
						if (
							error.code === 'FST_JWT_BAD_REQUEST' ||
							error.code === 'ERR_ASSERTION' ||
							error.code === 'FST_JWT_BAD_COOKIE_REQUEST'
						)
							return reply.code(400).send({ code: error.code, message: error.message });
						return reply.code(401).send({ code: error.code, message: 'Unauthorized' });
					} else {
						return reply.code(401).send({ message: 'Unknown error' });
					}
				}
		}

        const sql = `
            SELECT * FROM gameInviteNotifs WHERE receiverID = ?
        `;
        const params = [userID];
        const notifs: gameNotif[] = await request.server.dbGameManager.all<gameNotif[]>(sql, params);
        reply.code(200).send(notifs);
    } catch (error) {
        request.server.log.error(`[GAME INVITE] Error checking notifs: ${error}`);
        throw error;
    }
}
