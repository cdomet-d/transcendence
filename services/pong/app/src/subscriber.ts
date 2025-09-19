import { connect, StringCodec } from 'nats';
import type { GameRegistry } from './classes/gameRegistry.class.js';
import { Game } from './classes/game.class.js';
import type { gameInfo } from './classes/game.class.js'

export async function natsSubscribtion(gameRegistry: GameRegistry) {
  let token: string | undefined = process.env.NATS_SERVER_TOKEN;
  if (!token)
    throw new Error("NATS token undefined");
  const nc = await connect({ servers: "nats://nats-server:4222", token: token});

  const sc = StringCodec();

  const sub = nc.subscribe('game.start');
  (async () => {
    for await (const msg of sub) {
      // add game object to tab
      let _gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
      gameRegistry.addGame(new Game(_gameInfo));
      console.log(`Received message: ${JSON.stringify(_gameInfo)}`);
      //TODO: send back a message saying the object was received
    }
  })();

  console.log(`Listening for messages on "game.start"...`);
};
