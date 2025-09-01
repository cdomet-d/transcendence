require('dotenv').config();

const { connect, StringCodec } = require('nats');

(async () => {
  const nc = await connect({ servers: "nats://nats-server:4222" , token: process.env.NATS_SERVER_TOKEN});

  const sc = StringCodec();

  const sub = nc.subscribe('matchmaking.ready');
  (async () => {
    for await (const msg of sub) {
      console.log(`Received message: ${sc.decode(msg.data)}`);
    }
  })();

  console.log(`Listening for messages on "matchmaking.ready"...`);
})();