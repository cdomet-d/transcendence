import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import { updatePaddlePos } from "../src/handlers/paddle";
import type { Player } from '../src/classes/player.class';
import type { keysObj } from '../src/handlers/mess.validation';
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

	// w
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

	// ArrowUp
	test('left player | paddle up | ArrowUp key', () => {
		keys._ArrowUp = true;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(108);
	});

	test('right player | paddle up | ArrowUp key', () => {
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(107);
	});

	test('right player | paddle up | y = 0', () => {
		rightPlayer.paddle.y = 0;
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(0);
		rightPlayer.paddle.y = 108;
		keys._ArrowUp = false;
	});

	// s
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

	test('right player | paddle down | s key', () => {
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(108);
		keys._s = false;
	});

	// ArrowDown
	test('left player | paddle down | ArrowDown key', () => {
		keys._ArrowDown = true;
		updatePaddlePos(leftPlayer, keys, delta);
		expect(leftPlayer.paddle.y).toBe(108);
	});

	test('right player | paddle down | ArrowDown key', () => {
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(109);
	});

	test('right player | paddle down | y = HEIGHT', () => {
		rightPlayer.paddle.y = HEIGHT;
		updatePaddlePos(rightPlayer, keys, delta);
		expect(rightPlayer.paddle.y).toBe(HEIGHT);
		rightPlayer.paddle.y = 108;
		keys._ArrowDown = false;
	});
});
