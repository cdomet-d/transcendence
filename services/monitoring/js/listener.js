
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Account Microservice Listener');
})

console.log('Monitoring Microservice listening on 1919')
server.listen(1919);