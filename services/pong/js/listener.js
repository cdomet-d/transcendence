
import http from 'http';
import fs from 'fs/promises';
const port = 2020;//process.env.PORT;
//va recupérer la valeur de PORT dans le fichier .env
//pour qu'à l'exec ça fonctionne il faut faire "node --env-file=.env listener.js"

const server = http.createServer(async (req, res) => {
	console.log(req.url);
	console.log(req.method);
	//TODO:l'ecrire dans un fichier qui est dans un volume
	const payload = await fs.readFile("index.html");
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.write(payload);
	res.end();
})

server.listen(port, () => {
	console.log(`Pong Microservice listening on ${port}`)
});
// le deuxième argument donné à listen est une fonction callback asynchrone
// elle sera executé seulement lorsque le server est lancé et qu'il écoute sur le port 2020
// ainsi le callback pourrait être utilisé pour logger que le service est pret