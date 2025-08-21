
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Users Microservice Listener');
})

console.log('Users Microservice listening on 2626')
server.listen(2626);