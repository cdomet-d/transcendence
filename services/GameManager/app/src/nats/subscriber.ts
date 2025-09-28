import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { createTournament } from '../tournament/tournament.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('pregame.remote.4.request');
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log("GM received: ", payload);
      createTournament(payload);
    }
  })();
}