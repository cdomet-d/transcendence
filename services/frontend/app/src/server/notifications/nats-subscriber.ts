import { connect, StringCodec, type NatsConnection } from 'nats';
import type { FastifyInstance } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

export async function initNatsConnection(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token });
	return (nc);
}

interface friendNotif {
	type: 'FRIEND_REQUEST',
	senderUsername: string,
	receiverID: number //will be string eventually
}

type GameType = '1 vs 1' | 'tournament';
interface gameNotif {
	type: 'GAME_INVITE',
	receiverName: string,
	receiverID: number, //will be string eventually
	gameType: GameType,
}

export async function natsSubscription(serv: FastifyInstance) {
	const sc = StringCodec();

	const sub = serv.nc.subscribe('post.notif');

	(async () => {
		for await (const msg of sub) {
			const notif: friendNotif | gameNotif = JSON.parse(sc.decode(msg.data));
			// serv.log.error(`Received message: ${JSON.stringify(notif)}`);
			
			const receiverWS: WebSocket | undefined = serv.users.getUserSocket(notif.receiverID)
			if (receiverWS === undefined) {
				//TODO
				serv.log.error("receiver not found")
				return;
			}
			if (receiverWS.OPEN)
				receiverWS.send(JSON.stringify(notif));
		}
	})();
}
