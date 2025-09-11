import 'dotenv/config';
import { connect, StringCodec } from 'nats';

export async function natsSubscribtion() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const sc = StringCodec();

  const sub = nc.subscribe('matchmaking.ready');
  (async () => {
    for await (const msg of sub) {
      console.log(`Received message: ${sc.decode(msg.data)}`);
    }
  })();

  console.log(`Listening for messages on "matchmaking.ready"...`);
};
