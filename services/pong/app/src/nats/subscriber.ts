import 'dotenv/config';
import { connect, StringCodec } from 'nats';

export async function natsSubscribtion() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const sc = StringCodec();

  const game = nc.subscribe('game.ready');
  (async () => {
    for await (const msg of game) {
      // console.log(`Received message: ${sc.decode(msg.data)}`);
      
      // prepareGame(msg.data);
      if (msg.reply)
        nc.publish(msg.reply, msg.data);
      console.log(`8\nPong sent "game.ready"`);
    }
  })();

  console.log(`Listening for messages on "game.ready"...`);
};
