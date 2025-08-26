import fsp from 'fs/promises';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

async function upgrade(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const script = await fsp.readFile('frontend/index.html');
  rep.header('Content-Type', 'text/html');
  rep.send(script);
}

function wshandler(socket: WebSocket, req: FastifyRequest): void {
  req.server.log.info('WebSocket connection established');

  socket.on('message', (message: string) => {
      socket.send('hi from server');
      req.server.log.info(`client sent: ${message}`);
    });
}

export { upgrade, wshandler };