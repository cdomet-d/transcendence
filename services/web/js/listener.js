
import http from 'http';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Web Microservice Listener\nCurrent supported routes:\n \
	/user/account\n \
	/user/friends\n \
	/user/search\n \
	/game/tournament\n \
	/game/leaderboard\n \
	/game/match');
})

console.log('Web Microservice listening on 1212')
server.listen(1212);

