
import http from 'http';
import fs from 'fs';
const port = process.env.PORT;
//va recupérer la valeur de PORT dans le fichier .env
//pour qu'à l'exec ça fonctionne il faut faire "node --env-file=.env listener.js"

const server = http.createServer((req, res) => {
	console.log(req.url);
	console.log(req.method);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end('<h1>Pong Microservice Listener</h1>');
})

server.listen(port, () => {
	console.log(`Pong Microservice listening on ${port}`)
});
// le deuxième argument donné à listen est une fonction callback asynchrone
// elle sera executé seulement lorsque le server est lancé et qu'il écoute sur le port 2020
// ainsi le callback pourrait être utilisé pour logger que le service est pret