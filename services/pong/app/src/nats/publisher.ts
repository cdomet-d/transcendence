import { connect, StringCodec, type NatsConnection } from 'nats';

export async function natsPublish(nc: NatsConnection, subject: string, payload: string, replySubject?: string) {
	const sc = StringCodec();

	const reply = replySubject ? { reply: replySubject } : undefined;
	nc.publish(subject, sc.encode(payload), reply);
}
