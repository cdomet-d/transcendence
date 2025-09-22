import dotenv from 'dotenv';
import { connect, StringCodec } from 'nats';
import type { NatsConnection } from 'nats';

dotenv.config();

let nc: NatsConnection | undefined;

export async function natsConnect(): Promise<NatsConnection> {
  if (!nc) {
    let token = process.env.NATS_SERVER_TOKEN;
    nc = await connect({ servers: "nats://nats-server:4222", token: token ?? ""});
  }
  return nc;
};

export async function natsPublish(subject: string, data: string) {
  
  const connection: NatsConnection = await natsConnect();
  const sc = StringCodec();

  connection.publish(subject, sc.encode(data));

  // await connection.flush();
  // await connection.drain();
}