import 'dotenv/config';
import { connect, StringCodec } from 'nats';
import { wsSend } from '../lobby/wsHandler.js';
import { tournamentState } from '../tournament/tournamentRoutine.js';
import { wsClientsMap } from '../lobby/wsHandler.js';

export async function natsSubscribe() {
  let token = process.env.NATS_SERVER_TOKEN;
  const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });

  const pregame = nc.subscribe('game.reply'); // where PONG answers "game.request"
  (async () => {
    for await (const msg of pregame) {
      const sc = StringCodec();
      const payload = JSON.parse(sc.decode(msg.data));
      // PAYLOAD IS gameRequestObj (see pong/subscriber.ts)
      		console.log("8");

      console.log(`GM received in "game.reply" : `, payload);
      console.log(`payload `, payload.event);

      if (payload.event !== "approved") {
        console.log("Error: PONG has denied game.request!")
        return;
      }

      // signal BOTH client via WS their match is ready
      // parse payload.users and find their IDs
      // parse clientMap to get their socket

      // for (let i = 0; i < payload.users.length; i++) {
      for (let i = 0; i < 2; i++) {
        const userID = payload.users[i].userID;

        const socket = wsClientsMap.get(userID);

        const gameRequest = {
          userID: userID,
          gameID: payload._gameID
        }

        wsSend(socket, JSON.stringify(gameRequest));
      }
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