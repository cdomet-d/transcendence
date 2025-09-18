import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { natsPublish } from './publisher.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const sc = StringCodec();

  const pregame = nc.subscribe('pregame.local.2players.create');
  (async () => {
    for await (const msg of pregame) {
      console.log(`Received message: ${sc.decode(msg.data)}`);
  	  // RESPOND THAT GAME IS READY
      natsPublish();
    }
  })();

  console.log(`Listening for messages on "pregame.local.2players.create"...`);
};
