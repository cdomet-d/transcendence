import { natsPublish } from "../nats/publisher.js";

export function handleTournamentRequest(data: any) {
    const payload = data.payload;
    natsPublish("pregame.remote.4.request", JSON.stringify(payload));
}