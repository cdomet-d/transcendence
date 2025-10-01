import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import { updatePaddlePos } from "../src/handlers/paddle";
import type { Player } from '../src/classes/player.class';
import type { keysObj } from '../src/handlers/pong';

describe("paddle update", () => {
	const player = {
		paddle: { y: 108 },
		left: true,
		right: false,
	} as unknown as Player;

	test('left player moves paddle up when w key is pressed', () => {
		const keys: keysObj = { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false };
		const delta = 5;
		updatePaddlePos(player, keys, delta);
		expect(player.paddle.y).toBe(107);
	});
});

