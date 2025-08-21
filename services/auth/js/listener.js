
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Auth Microservice Listener');
})

console.log('Auth Microservice listening on 3939')
server.listen(3939);