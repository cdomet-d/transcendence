import { connect, type NatsConnection } from "nats";

export async function initNatsConnection(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token });
	return (nc);
}
