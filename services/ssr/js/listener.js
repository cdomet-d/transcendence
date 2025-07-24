
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('SSR Microservice Listener');
})

console.log('SSR Microservice listening on 3838')
server.listen(3838);