import {describe, expect, test, afterEach, beforeEach, jest} from '@jest/globals';
import { setMessEvent } from '../src/handlers/pong';

describe("setMessEvent", () => {
	let player: any;
	let opponent: any;
	let sendReply: jest.Mock;

	beforeEach(() => {
		player = {
			socket: {
				on: jest.fn(),
			}
		};
		opponent = {};
		sendReply = jest.fn();
	});

	test("ignores payloads that are not valid messObj", () => {
		// Simulate the message handler
		let handler: Function = () => {};
		player.socket.on.mockImplementation((event: string, fn: Function) => {
			handler = fn;
		});

		setMessEvent(player, opponent, sendReply);

		// Not a valid messObj (missing _keys and _timeStamp)
		const invalidPayload = JSON.stringify({ foo: "bar" });
		handler(invalidPayload);

		expect(sendReply).not.toHaveBeenCalled();
	});

	test("ignores payloads with missing _keys", () => {
		let handler: Function = () => {};
		player.socket.on.mockImplementation((event: string, fn: Function) => {
			handler = fn;
		});

		setMessEvent(player, opponent, sendReply);

		const payload = JSON.stringify({ _timeStamp: 123 });
		handler(payload);

		expect(sendReply).not.toHaveBeenCalled();
	});

	test("ignores payloads with missing _timeStamp", () => {
		let handler: Function = () => {};
		player.socket.on.mockImplementation((event: string, fn: Function) => {
			handler = fn;
		});

		setMessEvent(player, opponent, sendReply);

		const payload = JSON.stringify({ _keys: { _w: true } });
		handler(payload);

		expect(sendReply).not.toHaveBeenCalled();
	});

	test("calls sendReply if keysDown returns true and messObj is valid", () => {
		let handler: Function = () => {};
		player.socket.on.mockImplementation((event: string, fn: Function) => {
			handler = fn;
		});

		setMessEvent(player, opponent, sendReply);

		const payload = JSON.stringify({ _keys: { _w: true }, _timeStamp: 100 });
		handler(payload);

		expect(sendReply).toHaveBeenCalledWith(player, opponent, { _w: true }, 100);
	});
});