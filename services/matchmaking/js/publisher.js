import dotenv from 'dotenv';
import { connect, StringCodec } from 'nats';

dotenv.config();

export async function launchMM() {
  const nc = await connect({ servers: "nats://nats-server:4222" , token: process.env.NATS_SERVER_TOKEN });
  const sc = StringCodec();

  nc.publish('matchmaking.ready', sc.encode('Players paired up!\n\n Waiting for GameCreation...'));
  console.log(`Published message to "matchmaking.ready"`);

  await nc.flush();
  await nc.drain();
};