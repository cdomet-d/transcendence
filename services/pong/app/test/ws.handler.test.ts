import * as pong from '../src/game/pong';
import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import { wsHandler } from '../src/game/ws.handler';

describe('wsHandler', () => {
    let mockFastify: any;
    let mockSocket1: any;
    let mockSocket2: any;
    let mockReq: any;
    let mockGame: any;
	let ids: any;

    beforeEach(() => {
		ids = { gameid: 42, userid: 7 };
        mockSocket1 = {
            on: jest.fn(),
            once: jest.fn((event: string, handler: (data: any) => void) => {
                if (event === 'message') {
                    handler(JSON.stringify(ids));
                }
            })
        };
        mockSocket2 = {
            on: jest.fn(),
            once: jest.fn((event: string, handler: (data: any) => void) => {
                if (event === 'message') {
                    handler(JSON.stringify(ids));
                }
            }),
			send: jest.fn(),
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
    });

    test('logs connection and adds player', () => {
        wsHandler.call(mockFastify, mockSocket1, mockReq);
        expect(mockFastify.log.info).toHaveBeenCalledWith('WebSocket connection established');
        expect(mockSocket1.once).toHaveBeenCalledWith('message', expect.any(Function));
        expect(mockGame.addPlayer).toHaveBeenCalled();
        expect(mockGame.players.length).toBe(1);
        // expect(mockSocket1.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

	test('throws if userID or gameID is NaN', () => {
		ids = {gameid: 'notanumber', userid: 'nan'};
		expect(() =>
			wsHandler.call(mockFastify, mockSocket1, mockReq)
		).toThrow('wrong ID');
	});

    test('throws if game not found', () => {
        mockFastify.gameRegistry.findGame = jest.fn().mockReturnValue(undefined);
        expect(() =>
            wsHandler.call(mockFastify, mockSocket1, mockReq)
        ).toThrow('game not found');
    });

    test('throws if game already has 2 players', () => {
        mockGame.players = [{}, {}];
        expect(() =>
            wsHandler.call(mockFastify, mockSocket1, mockReq)
        ).toThrow('not allowed');
    });

    test('adds local player if game.local is true', () => {
        mockGame.local = true;
        wsHandler.call(mockFastify, mockSocket1, mockReq);
        expect(mockSocket1.once).toHaveBeenCalledWith('message', expect.any(Function));
        expect(mockGame.addPlayer).toHaveBeenCalledTimes(2);
        expect(mockGame.players.length).toBe(2);
    });

    test('calls setUpGame if players reach 2 when local', () => {
        mockGame.local = true;
        jest.spyOn(pong, 'setUpGame');
        wsHandler.call(mockFastify, mockSocket1, mockReq);
        expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
    });

    test('calls setUpGame if players reach 2 when remote', () => {
        jest.spyOn(pong, 'setUpGame');
        wsHandler.call(mockFastify, mockSocket1, mockReq);
        wsHandler.call(mockFastify, mockSocket2, mockReq);
        expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
    });
});
