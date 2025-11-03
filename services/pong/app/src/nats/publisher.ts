import { connect, StringCodec, type NatsConnection } from 'nats';

let nc: NatsConnection;

export async function natsConnect(): Promise<NatsConnection> {
	if (!nc) {
		let token: string | undefined = process.env.NATS_SERVER_TOKEN;
		if (!token)
			throw new Error("NATS token undefined");
		nc = await connect({ servers: "nats://nats-server:4222", token: token });
	}
	return nc;
};

export async function natsPublish(subject: string, payload: string, replySubject?: string) {

	const connection: NatsConnection = await natsConnect();
	const sc = StringCodec();

	const reply = replySubject ? { reply: replySubject } : undefined;
	connection.publish(subject, sc.encode(payload), reply);

	// await connection.flush();
	// await connection.drain();
}