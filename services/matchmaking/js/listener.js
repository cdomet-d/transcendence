
import http from 'http';
import { launchMM } from './publisher.js';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Matchmaking Microservice Listener');
})

console.log('Matchmaking Microservice listening on 1818')
server.listen(1818);

launchMM();