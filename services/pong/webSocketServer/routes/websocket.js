import {upgrade, wshandler} from '../controllers/websocket.js'

const opts = {
    schema: {}, //TODO: get coralie's json object
    handler: upgrade,
    wsHandler: wshandler,
}

function wsRoute(serv, options, done) {
    serv.get('/game/match', opts);
    done();
}

export default wsRoute;