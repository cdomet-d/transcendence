import * as pong from '../src/game/pong';
import {describe, expect, test, afterEach, beforeEach, jest, } from '@jest/globals';
import { wsHandler, waitForMessage } from '../src/game/ws.handler';
import * as validation from '../src/game/mess.validation';

describe('waitForMessage', () => {
    let mockSocket: any;

    beforeEach(() => {
        mockSocket = {
            once: jest.fn()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('resolves with valid ids', async () => {
        const idsObj = { gameID: 1, userID: 2 };
        jest.spyOn(validation, 'validIds').mockReturnValue(true);
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify(idsObj));
        })
        await expect(waitForMessage(mockSocket)).resolves.toEqual(idsObj);
    });

    test('rejects with invalid ids', async () => {
        const idsObj = { gameID: "nan", userID: 2 };
        jest.spyOn(validation, 'validIds').mockReturnValue(false);
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify(idsObj));
        });
        await expect(waitForMessage(mockSocket)).rejects.toThrow('Invalid ids');
    });

    test('rejects with malformed JSON', async () => {
        jest.spyOn(validation, 'validIds').mockReturnValue(true);
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler('not a json');
        });
        await expect(waitForMessage(mockSocket)).rejects.toThrow();
    });
});

describe('wsHandler integration', () => {
    let mockFastify: any;
    let mockSocket: any;
    let mockReq: any;
    let mockGame: any;

    beforeEach(() => {
        mockSocket = {
            on: jest.fn(),
            once: jest.fn(),
            send: jest.fn()
        };
        mockReq = {};
        mockGame = {
            players: [],
            gameID: 42,
            local: false,
            addPlayer: jest.fn(function(this: typeof mockGame, player) {
                this.players.push(player);
            }),
            deletePlayers: jest.fn(),
            randUserID: 99
        };
        mockFastify = {
            log: { info: jest.fn() },
            gameRegistry: {
                findGame: jest.fn().mockReturnValue(mockGame)
            }
        };
        jest.spyOn(validation, 'validIds').mockReturnValue(true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('calls setUpGame for remote when players reach 2', () => {
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify({ gameID: 42, userID: 7 }));
        });
        jest.spyOn(pong, 'setUpGame');
        wsHandler.call(mockFastify, mockSocket, mockReq);
        wsHandler.call(mockFastify, mockSocket, mockReq); //TODO: test with diff ids when implemented
        expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
    });

    test('calls setUpGame for local when players reach 2', () => {
        mockGame.local = true;
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify({ gameID: 42, userID: 7 }));
        });
        jest.spyOn(pong, 'setUpGame');
        wsHandler.call(mockFastify, mockSocket, mockReq);
        expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
    });

    test('throws "game not found" if gameRegistry returns undefined', async () => {
        mockFastify.gameRegistry.findGame = jest.fn().mockReturnValue(undefined);
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify({ gameID: 42, userID: 7 }));
        });
        await expect(() => wsHandler.call(mockFastify, mockSocket, mockReq)).toThrow('game 42 not found');
    });

    test('throws "not allowed" if game already has 2 players', async () => {
        mockGame.players = [{}, {}];
        mockSocket.once.mockImplementation((event: string, handler: (data: any) => void) => {
            handler(JSON.stringify({ gameID: 42, userID: 7 }));
        });
        await expect(() => wsHandler.call(mockFastify, mockSocket, mockReq)).toThrow('not allowed');
    });
});
