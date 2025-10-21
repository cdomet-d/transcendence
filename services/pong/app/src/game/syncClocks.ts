import type { Player } from '../classes/player.class.js';
import { MessageEvent } from 'ws';

const START_DELAY = 500;

interface startObj {
	clientTimeStamp: number,
	serverTimeStamp: number,
	delay: number,
	ballDir: number,
}

export function syncClocks(player: Player, playerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const MAX_SYNC = 3;
        const TIMEOUT = 3000;

        const timer = setTimeout(() => {
            player.socket.removeEventListener('message', handler);
            reject(new Error("Clock sync timeout"));
        }, TIMEOUT);

        const handler = (event: MessageEvent) => {
            const clientTimestamp = Number(event.data);
            if (Number.isNaN(clientTimestamp))
                return;

            const start: startObj = {
                clientTimeStamp: clientTimestamp,
                serverTimeStamp: performance.now(),
                delay: START_DELAY,
                ballDir: playerId === 2 ? -1 : 1
            };

            player.socket.send(JSON.stringify(start));
            player.incSyncClockCount();

            if (player.syncClockCount === MAX_SYNC) {
                clearTimeout(timer);
                player.socket.removeEventListener('message', handler);
                resolve();
            }
        };

        player.socket.addEventListener('message', handler);
    });
}
