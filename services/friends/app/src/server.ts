import { buildServer } from './app.js';

const start = async () => {
    let serv;
    try {
        serv = await buildServer();
        await serv.listen({ port: 1616, host: '0.0.0.0' });
        serv.log.info(serv.printRoutes());
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
