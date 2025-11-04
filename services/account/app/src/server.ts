import { buildServer } from './app.js';

const start = async () => {
	let serv;
	try {
		serv = await buildServer();

		console.log('listening on 1414');
		await serv.listen({ port: 1414, host: '0.0.0.0' });

	} catch (err) {
		if (serv) {
			serv.log.error(err, 'Server failed to start');
		} else {
			console.error('Error during server build:', err);
		}
		process.exit(1);
	}
};

start();

