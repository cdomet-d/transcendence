const { connect } = require('nats');

(async () => {
  const nc = await connect({ servers: "nats://nats-server:4222" });
  const js = nc.jetstream();

  const sub = await js.subscribe('my-subject');
  (async () => {
    for await (const msg of sub) {
      console.log(`Received message: ${msg.data.toString()}`);
      msg.ack();
    }
  })();

})();
