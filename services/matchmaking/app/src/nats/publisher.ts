import dotenv from 'dotenv';
import { connect, StringCodec } from 'nats';

dotenv.config();

export async function natsPublish() {

  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? ""});
  const sc = StringCodec();

  nc.publish('pregame.local.2players.ready', sc.encode('Players paired up!\n\n Waiting for GameCreation...'));
  console.log(`Published message to "pregame.local.2players.ready"`);

  await nc.flush();
  await nc.drain();
};
