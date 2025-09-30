import { init } from '../src/server.js';
import type { FastifyInstance } from 'fastify';
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import WebSocket from 'ws';

describe('Fastify server', () => {
    let server: FastifyInstance;
    let address: string;

    beforeAll(async () => {
        server = await init();
        await server.ready();
        address = await server.listen({ port: 0 });
    });

    afterAll(async () => {
        await server.close();
    });

    test('WebSocket should respond correctly', async () => {
        const wsUrl = address.replace(/^https/, 'wss') + "/api/game/match";

        await new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

            ws.on('open', () => {
                ws.send('Hey server');
            });

            ws.on('message', (data: any) => {
                try {
                    expect(data.toString()).toBe('Hey from server');
                    ws.close();
                } catch (err) {
                    reject(err);
                }
            });

            ws.on('close', () => resolve());
            ws.on('error', (err: any) => reject(err));
        });
    });
});
