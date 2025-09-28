import 'dotenv/config';
import { StringCodec, type NatsConnection } from 'nats';
import { natsConnect, natsPublish } from './publisher.js';

interface userInfo {
  userID: number,
  username: string
}

interface matchObj {
  matchID: number,
  tournamentID: number,
  remote: boolean,
  users: userInfo[],
  score: string,
  winner: userInfo,
  loser: userInfo,
}

export async function natsSubscribe() {
  const connection: NatsConnection = await natsConnect();
  const sc = StringCodec();

  const pregame = connection.subscribe('tournament.start');
  (async () => {
    for await (const payload of pregame) {
      console.log("5");
      console.log(`Received message from GameManager: ${sc.decode(payload.data)}\n\n`);

      // WS SIGNAL FRONT "GAME.READY" + GAME_ID
    }
  })();
};
