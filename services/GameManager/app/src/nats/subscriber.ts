import 'dotenv/config';
import { connect, StringCodec } from 'nats';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('pregame.quickMatch.local.2.ready');
  (async () => {
    for await (const payload of pregame) {
      // console.log(`Received message: ${sc.decode(msg.data)}`);
      // nc.publish('game.ready', payload.data);
      console.log("7");
      console.log("received matchObj in GM\n\n");
    }
  })();

    const game = nc.subscribe('game.waiting');
  (async () => {
    for await (const msg of game) {
      // console.log(`Received message: ${sc.decode(msg.data)}`);
      // SIGNAL CLIENT AND CLOSE WS
      console.log(`Manager received message from MM!\n`);
    }
  })();
};
