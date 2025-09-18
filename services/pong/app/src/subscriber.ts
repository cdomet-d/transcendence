import { connect, StringCodec } from 'nats';
import type { gameInfo } from './classes/game.class.js'

export async function natsSubscribtion() {
  let token: string | undefined = process.env.NATS_SERVER_TOKEN;
  if (!token)
    throw new Error("NATS token undefined");
  const nc = await connect({ servers: "nats://nats-server:4222", token: token});

  const sc = StringCodec();

  const sub = nc.subscribe('game.start');
  (async () => {
    for await (const msg of sub) {
      // add game object to tab
      let gameobj: gameInfo = JSON.parse(sc.decode(msg.data));
      console.log(`Received message: ${JSON.stringify(gameobj)}`);
      //TODO: send back a message saying the object was received
    }
  })();

  console.log(`Listening for messages on "game.start"...`);
};
