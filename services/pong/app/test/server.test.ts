import { init } from '../src/server.ts';
import type { FastifyInstance } from 'fastify';
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import WebSocket from 'ws';

describe('Fastify server', () => {
    let server: FastifyInstance;
    let address: string;

    beforeAll(async () => {
        server = init();
        await server.ready();
        address = await server.listen({ port: 0 });
    });

    afterAll(async () => {
        await server.close();
    });

    test('WebSocket should respond correctly', (done) => {
        const wsUrl = address.replace(/^https/, 'wss') + "/api/game/match";

        const ws = new WebSocket(wsUrl);

        ws.on('open', () => {
            ws.send('Hey server');
        });

        ws.on('message', (data) => {
            expect(data.toString()).toBe('Hey from server');
            ws.close();
        });

        ws.on('close', () => {
            done();
        });

        ws.on('error', (err) => {
            done(err);
        });
    });
});
