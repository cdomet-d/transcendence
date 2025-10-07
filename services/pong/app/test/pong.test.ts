import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import { setMessEvent } from '../src/game/pong';

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
        opponent = {
            socket: {
                on: jest.fn(),
            }
        };
        sendReply = jest.fn();
    });

    test("ignores payloads that are not valid messObj", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

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

        const payload = JSON.stringify({ _keys: { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false } });
        handler(payload);

        expect(sendReply).not.toHaveBeenCalled();
    });

    test("calls sendReply if keysDown returns true and messObj is valid", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

        const payload = JSON.stringify({ _keys: { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false }, _timeStamp: 100 });
        handler(payload);

        expect(sendReply).toHaveBeenCalledWith(player, opponent, { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false }, 100);
    });

    test("ignores payloads with _keys all false", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

        const payload = JSON.stringify({ _keys: { _w: false, _s: false, _ArrowUp: false, _ArrowDown: false }, _timeStamp: 200 });
        handler(payload);

        expect(sendReply).not.toHaveBeenCalled();
    });

    test("ignores malformed JSON payloads", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

        const malformedPayload = "{ _keys: true, _timeStamp: 123"; // missing closing }
        handler(malformedPayload);

        expect(sendReply).not.toHaveBeenCalled();
    });

    test("calls sendReply with correct delta between frames", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

        const payload1 = JSON.stringify({ _keys: { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false }, _timeStamp: 100 });
        const payload2 = JSON.stringify({ _keys: { _w: false, _s: true, _ArrowUp: false, _ArrowDown: false }, _timeStamp: 120 });
        handler(payload1);
        handler(payload2);

        expect(sendReply).toHaveBeenNthCalledWith(1, player, opponent, { _w: true, _s: false, _ArrowUp: false, _ArrowDown: false }, 100);
        expect(sendReply).toHaveBeenNthCalledWith(2, player, opponent, { _w: false, _s: true, _ArrowUp: false, _ArrowDown: false }, 20);
    });

    test("ignores payloads with _keys not an object", () => {
        let handler: Function = () => {};
        player.socket.on.mockImplementation((event: string, fn: Function) => {
            handler = fn;
        });

        setMessEvent(player, opponent, sendReply);

        const payload = JSON.stringify({ _keys: "not-an-object", _timeStamp: 123 });
        handler(payload);

    	expect(sendReply).not.toHaveBeenCalled();
    });
});
