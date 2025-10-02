import * as pong from '../src/game/pong';
import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import { wshandler } from '../src/game/ws.handler';

describe('wshandler', () => {
	let mockFastify: any;
	let mockSocket1: any;
	let mockSocket2: any;
	let mockReq: any;
	let mockGame: any;

	beforeEach(() => {
		mockSocket1 = {
			on: jest.fn()
		};
		mockSocket2 = {
			on: jest.fn()
		};
		mockReq = {
			cookies: {
				gameid: '42',
				userid: '7'
			}
		};
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
		wshandler.call(mockFastify, mockSocket1, mockReq);
		expect(mockFastify.log.info).toHaveBeenCalledWith('WebSocket connection established');
		expect(mockGame.addPlayer).toHaveBeenCalled();
		expect(mockGame.players.length).toBe(1);
		// expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
	});

	// test('throws if userID or gameID is NaN', () => {
	// 	mockReq.cookies.gameid = 'notanumber';
	// 	expect(() =>
	// 		wshandler.call(mockFastify, mockSocket1, mockReq)
	// 	).toThrow('wrong ID');
	// });

	test('throws if game not found', () => {
		mockFastify.gameRegistry.findGame = jest.fn().mockReturnValue(undefined);
		expect(() =>
			wshandler.call(mockFastify, mockSocket1, mockReq)
		).toThrow('game not found');
	});

	test('throws if game already has 2 players', () => {
		mockGame.players = [{}, {}];
		expect(() =>
			wshandler.call(mockFastify, mockSocket1, mockReq)
		).toThrow('not allowed');
	});

	test('adds local player if game.local is true', () => {
		mockGame.local = true;
		wshandler.call(mockFastify, mockSocket1, mockReq);
		expect(mockGame.addPlayer).toHaveBeenCalledTimes(2);
		expect(mockGame.players.length).toBe(2);
	});

	test('calls setUpGame if players reach 2 when local', () => {
		mockGame.local = true;
		jest.spyOn(pong, 'setUpGame');
		wshandler.call(mockFastify, mockSocket1, mockReq);
		expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
	});

	test('calls setUpGame if players reach 2 when remote', () => {
		jest.spyOn(pong, 'setUpGame');
		wshandler.call(mockFastify, mockSocket1, mockReq);
		wshandler.call(mockFastify, mockSocket2, mockReq);
		expect(pong.setUpGame).toHaveBeenCalledWith(mockGame);
	});
});
