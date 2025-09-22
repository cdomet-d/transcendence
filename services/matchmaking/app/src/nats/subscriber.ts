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

  const pregame = connection.subscribe('pregame.quickMatch.local.2.create');
  (async () => {
    for await (const payload of pregame) {
      console.log("5");
      console.log(`Received message from GameManager: ${sc.decode(payload.data)}`);

        // const matchObj = matchmaking();
          const user1: userInfo = JSON.parse(sc.decode(payload.data));
          const user2: userInfo = {
            userID: 2,
            username: "uel"
          }

          const userList: userInfo[] = [user1, user2];

          const subject: string | undefined = payload.reply;
          if (subject === undefined) {
            console.log("NO REPLY SUBJECT IN MM SUB");
            return; // return NULL or smtn
          }
          const matchObj = {
            matchID: 1 ,
            tournamentID: 0,
            remote: false,
            users: userList,
            score: "",
            winner: "",
            loser: ""
          }
        // return matchObj;

      natsPublish(subject, JSON.stringify(matchObj));
    }
  })();

  console.log(`Listening for messages on "pregame.quickMatch.local.2.create"...`);
};
