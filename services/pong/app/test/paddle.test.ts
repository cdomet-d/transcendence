import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import { updatePaddlePos } from "../src/handlers/paddle";
import type { Player } from '../src/classes/player.class';
import type { keysObj } from '../src/handlers/pong';
const WIDTH = 480;
const HEIGHT = 270;

describe("paddle update", () => {
	const leftPlayer = {
		paddle: { y: 108 },
		left: true,
		right: false,
	} as unknown as Player;

	const rightPlayer = {
		paddle: { y: 108 },
		left: false,
		right: true,
	} as unknown as Player;

	const keys: keysObj = { _w: false, _s: false, _ArrowUp: false, _ArrowDown: false };
	const delta = 5;

	test('left player | paddle up | ArrowUp key', () => {
		keys._ArrowUp = true;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(108);
		keys._ArrowUp = false;
	});

	test('left player | paddle up | w key', () => {
		keys._w = true;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(107);
	});

	test('left player | paddle up | y = 0', () => {
		leftPlayer.paddle.y = 0;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(0);
		leftPlayer.paddle.y = 108;
	});

	test('right player | paddle up | w key', () => {
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(108);
		keys._w = false;
	});

	test('left player | paddle down | s key', () => {
		keys._s = true;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(109);
	});

	test('left player | paddle down | y = HEIGHT', () => {
		leftPlayer.paddle.y = HEIGHT;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(HEIGHT);
		keys._s = false;
		leftPlayer.paddle.y = 108;
	});
});

