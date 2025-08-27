const { connect } = require('nats');

(async () => {
  const nc = await connect({ servers: "nats://nats-server:4222" });
  const js = nc.jetstream();

  try {
    await js.addStream({ name: 'mystream', subjects: ['my-subject'] });
  } catch (err) {
  }

  const ack = await js.publish('my-subject', Buffer.from('Hello from MM!'));
  console.log(`Published with sequence: ${ack.seq}`);

  await nc.drain();
})();
