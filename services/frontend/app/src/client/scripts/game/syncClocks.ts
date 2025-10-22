import type { startObj } from "./mess.validation.js";
const MAX_SYNC = 3;

export async function syncClocks(ws: WebSocket): Promise<[number, number, startObj] | null> {
    const offsetsTab: Array< number > = new Array();
    const halfTripsTab: Array< number > = new Array();
    let start: startObj | null = null;
    let i: number = MAX_SYNC;

    while (i > 0) {
        //send client timestamp
        ws.send(JSON.stringify(performance.now()));
    
        // wait for server timestamp and delay
        start = await waitForMessage(ws); //TODO: handle reject
        const recvTime: number = performance.now();
        const halfTripTime: number = (recvTime - start.clientTimeStamp) / 2;
        const offset: number = start.serverTimeStamp + halfTripTime - recvTime;
        offsetsTab.push(offset);
        halfTripsTab.push(halfTripTime);
        i--;
    }

    if (!start) return null;

    const finalOffset: number = median(offsetsTab);
    const finalHalfTripTime: number = median(halfTripsTab);

    return [finalOffset, finalHalfTripTime, start];
}

function median(values: Array< number >): number {
    values.sort((a: number, b: number) => a - b);
    return values[(values.length + 1) / 2 - 1]!; //TODO: fix !
}

function waitForMessage(socket: WebSocket): Promise< startObj > {
    return new Promise((resolve, reject) => {
        socket.addEventListener('message', (event) => {
            try {
                const start: startObj = JSON.parse(event.data);
                // if (!validStart()) //TODO
                // 	reject(new Error("Invalid start"));
                resolve(start);
            } catch (err) {
                reject(err);
            }
        }, { once: true });
    });
}
