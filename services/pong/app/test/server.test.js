import { init } from '../src/server.ts';
describe('Fastify server', () => {
    let server;
    beforeAll(async () => {
        server = init();
        await server.ready();
    });
    afterAll(async () => {
        await server.close();
    });
    test('GET /some-route returns 200', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/some-route',
        });
        expect(response.statusCode).toBe(200);
    });
    // Pour tester une WebSocket, tu peux utiliser un client websocket dans tes tests Jest
});
