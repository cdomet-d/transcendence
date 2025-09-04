import { upgrade, wshandler } from '../handlers/websocket.js';
const opts = {
    schema: {},
    handler: upgrade,
    wsHandler: wshandler,
};
const wsRoute = function (serv, options, done) {
    serv.get('/matchmaking', opts);
    done();
};
export { wsRoute };
