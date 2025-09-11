import dotenv from 'dotenv';
import { connect, StringCodec } from 'nats';

dotenv.config();

export async function initNATS() {

  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? ""});
  const sc = StringCodec();

  nc.publish('matchmaking.ready', sc.encode('Players paired up!\n\n Waiting for GameCreation...'));
  console.log(`Published message to "matchmaking.ready"`);

  await nc.flush();
  await nc.drain();
};
