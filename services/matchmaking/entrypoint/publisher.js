require('dotenv').config();

const { connect, StringCodec } = require('nats');

(async () => {
  const nc = await connect({ servers: "nats://nats-server:4222" , token: process.env.NATS_SERVER_TOKEN });
  const sc = StringCodec();

  nc.publish('my-subject', sc.encode('Hello from MM!'));
  console.log(`Published message to 'my-subject'`);

  await nc.flush();
  await nc.drain();
})();
