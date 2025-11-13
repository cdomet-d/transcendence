import fsp from 'fs/promises';
import { paddlePos } from './pong.js';
async function upgrade(req, rep) {
    try {
        const script = await fsp.readFile("/usr/app/static/index.html");
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
    socket.on('message', (payload) => {
        const mess = payload.toString();
        req.server.log.info(`client sent: ${mess}`);
        if (mess.match("Pad:"))
            paddlePos(socket, mess);
    });
}
export { upgrade, wshandler };
