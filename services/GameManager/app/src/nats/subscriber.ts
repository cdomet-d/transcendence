import 'dotenv/config';
import { connect, StringCodec } from 'nats';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const sc = StringCodec();

  const pregame = nc.subscribe('pregame.local.2players.ready');
  (async () => {
    for await (const msg of pregame) {
      // console.log(`Received message: ${sc.decode(msg.data)}`);
      nc.publish('game.ready');
      // console.log(`SENT "game.ready"`);
    }
  })();

    const game = nc.subscribe('game.waiting');
  (async () => {
    for await (const msg of game) {
      // console.log(`Received message: ${sc.decode(msg.data)}`);
      // SIGNAL CLIENT AND CLOSE WS
      // console.log(`\nMATCH READY\n we can CLOSE client WS`);
    }
  })();

  console.log(`Listening for messages on "pregame.local.2players.ready"...`);
};
