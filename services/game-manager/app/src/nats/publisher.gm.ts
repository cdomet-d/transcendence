import type { FastifyInstance } from 'fastify';
import { connect, StringCodec, type NatsConnection } from 'nats';

let nc: NatsConnection;

export async function natsConnect(): Promise<NatsConnection> {
	if (!nc) {
		let token = process.env.NATS_SERVER_TOKEN;
		nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });
	}
	return nc;
};

export async function natsPublish(serv: FastifyInstance, subject: string, payload: string, replySubject?: string) {
	const sc = StringCodec();

	const reply = replySubject ? { reply: replySubject } : undefined;
	serv.nc.publish(subject, sc.encode(payload), reply);

	// await connection.flush();
	// await connection.drain();
}