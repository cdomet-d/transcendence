
import http from 'http';
const port = 2020;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Pong Microservice Listener');
})

server.listen(port, () => {
	console.log(`Pong Microservice listening on ${port}`)
});
// le deuxième argument donné à listen est une fonction callback asynchrone
// elle sera executé seulement lorsque le server est lancé et qu'il écoute sur le port 2020
// ainsi le callback pourrait être utilisé pour logger que le service est pret