import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('game.reply'); // where PONG answers "game.request"
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.reply" : `, payload);
      
      // signal each client via WS message match is ready for them
      const match = JSON.parse(payload);
      // for (let i = 0; i < match.users.length; i++) {
      //   wsSend(match.users[i].userID, "game.ready");
      // }

      const gameRequest = {
        event: "game.ready",
        matchID: match.matchID
      }

      // FOR NOW WE JUST SEND TO HOST CLIENT (our only WS client in list so far)
      wsSend(match.users[0].userID, JSON.stringify(gameRequest));
    }
  })();
  
  const postgame = nc.subscribe('game.over'); // where PONG sends game that just finished
  (async () => {
    for await (const msg of postgame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.over" : `, payload);

      tournamentState(payload);
    }
  })();
}