import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { sendWS } from '../handlers/wsHandler.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('pregame.quickMatch.local.2.ready');
  (async () => {
    for await (const payload of pregame) {
      console.log("7");
      console.log("received matchObj in GM\n\n");
      nc.publish('game.ready', payload.data, {reply: "game.waiting"});
    }
  })();

    const game = nc.subscribe('game.waiting');
  (async () => {
    for await (const msg of game) {
      // SIGNAL CLIENT AND CLOSE WS
      sendWS("game.waiting");
      console.log(`8\nPong says to GM: Game is WAITING\n`);
    }
  })();
};
