
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Friendship Microservice Listener');
})

console.log('Friendship Microservice listening on 1616')
server.listen(1616);