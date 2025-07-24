
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Dashboard Microservice Listener');
})

console.log('Dashboard Microservice listening on 1515')
server.listen(1515);