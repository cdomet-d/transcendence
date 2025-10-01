import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { createTournament } from '../tournament/tournament.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('game.ready'); // where PONG sends game ready to be played
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.ready" : `, payload);
      // signal Clients
    }
  })();
  
  const postgame = nc.subscribe('game.over'); // where PONG sends game that's over
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.over" : `, payload);
      // process endgame (continue tournament or not)
      // send updated matchObj to DB
      // tournamentState(payload);
    }
  })();
}