import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  // const declined = nc.subscribe('game.cancel'); // where PONG sends game that have malfunctionned
  // (async () => {
  //   for await (const msg of declined) {
  //     const sc = StringCodec();
  //     const payload = sc.decode(msg.data);
  //     console.log(`GM received in "game.cancel" : `, payload);
  //      // TODO: handle match error      
  //     }
  //   }
  // })();  
  
  const pregame = nc.subscribe('game.reply'); // where PONG sends game ready to be played
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.reply" : `, payload);
      
      const match = JSON.parse(payload);
      for (let i = 0; i < match.users.length; i++) {
        wsSend(match.users[i].userID, "game.ready");
      }
    }
  })();
  
  const postgame = nc.subscribe('game.over'); // where PONG sends game that's over
  (async () => {
    for await (const msg of postgame) {
      const sc = StringCodec();
      const payload = sc.decode(msg.data);
      console.log(`GM received in "game.over" : `, payload);
      // process endgame (continue tournament or not)
      // send updated matchObj to DB
      // tournamentState(payload);
    }
  })();
}