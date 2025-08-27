import fsp from 'fs/promises';
import { resolve } from 'path';
import { __dirname } from '../server.js';
async function upgrade(req, rep) {
    try {
        const filePath = resolve(__dirname, '../../public/index.html');
        const script = await fsp.readFile(filePath);
        rep.header('Content-Type', 'text/html');
        rep.send(script);
    }
    catch (err) {
        const error = err;
        rep.code(500).send(error.message);
    }
}
function wshandler(socket, req) {
    req.server.log.info('WebSocket connection established');
    socket.on('message', (message) => {
        socket.send('hi from server');
        req.server.log.info(`client sent: ${message}`);
    });
}
export { upgrade, wshandler };
