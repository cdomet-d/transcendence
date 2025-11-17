import { init } from '../src/server.js';
import type { FastifyInstance } from 'fastify';
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import WebSocket from 'ws';
import fs from 'fs/promises';

describe('Fastify server', () => {
    let server: FastifyInstance;
    let address: string;

    beforeAll(async () => {
        server = await init();
        address = await server.listen({ port: 0 });
    });

    afterAll(async () => {
        await server.close();
    });

    test('WebSocket should respond correctly', (done) => {
        const wsUrl = address.replace(/^https/, 'wss') + "/api/game/match";
        const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

        ws.on('open', () => {
            ws.close();
            setTimeout(async () => {
                const logFilePath = '/usr/app/server.log';
                const log = await fs.readFile(logFilePath, 'utf-8');
                expect(log).toContain('WebSocket connection established');
                done();
            }, 100);
        });
    });
});
