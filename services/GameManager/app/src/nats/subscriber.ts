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
    for await (const payload of game) {

      // receive matchObj
      console.log("HERE");
      const sc = StringCodec();

      const payloadString = sc.decode(payload.data);
      if (payloadString) {
        console.log("Payload STR: ", payloadString);
      }
      else {
        console.log("PayloadStr is empty");
      }
      const data = JSON.parse(payloadString);
      
      // const data = JSON.parse(sc.decode(payload.data));
      const userList = data.users;
      const userListLen = userList.length;

      // SIGNAL CLIENTS AND CLOSE WS
      for (let i = 0; i < userListLen ; i++) {
        console.log("CURRENT USER: ", userList[i].userID);
        sendWS(userList[i].userID, "game.waiting");
      }
      console.log(`9\nPong says to GM: Game is WAITING\n`);
    
    }
  })();
};
