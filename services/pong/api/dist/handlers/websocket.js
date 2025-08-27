import fsp from 'fs/promises';
async function upgrade(req, rep) {
    try {
        const script = await fsp.readFile("/usr/src/app/static/index.html");
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
