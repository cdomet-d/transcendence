
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Pong Microservice Listener');
})

console.log('Pong Microservice listening on 2020')
server.listen(2020);