import fsp from 'fs/promises';
async function upgrade(req, rep) {
    const script = await fsp.readFile('frontend/index.html');
    rep.header('Content-Type', 'text/html');
    rep.send(script);
}
function wshandler(socket, req) {
    req.server.log.info('WebSocket connection established');
    socket.on('message', (message) => {
        socket.send('hi from server');
        req.server.log.info(`client sent: ${message}`);
    });
}
export { upgrade, wshandler };
