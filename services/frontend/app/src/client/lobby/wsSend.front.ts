import { createVisualFeedback } from "../error";

const CLIENT_RATE_LIMIT_WINDOW = 1000; // in ms, so 1s
const CLIENT_MAX_MESSAGES_PER_WINDOW = 10; // lower than server limit (for obvious reasons)
const CLIENT_MAX_MESSAGE_SIZE = 10 * 1024; // 10KB

let messageCount = 0;
let windowResetTime = Date.now() + CLIENT_RATE_LIMIT_WINDOW;

export function canSendMessage(messageSize: number): { allowed: boolean; reason?: string } {
    if (messageSize > CLIENT_MAX_MESSAGE_SIZE) {
        return { allowed: false, reason: `Message size ${messageSize} exceeds limit of ${CLIENT_MAX_MESSAGE_SIZE} bytes` };
    }

    const now = Date.now();
    if (now > windowResetTime) {
        messageCount = 0;
        windowResetTime = now + CLIENT_RATE_LIMIT_WINDOW;
    }

    if (messageCount >= CLIENT_MAX_MESSAGES_PER_WINDOW) {
        const retryAfter = Math.ceil((windowResetTime - now) / 1000);
        return { allowed: false, reason: `Rate limit exceeded. Retry in ${retryAfter}s` };
    }

    messageCount++;
    return { allowed: true };
}

export function wsSafeSend(ws: WebSocket, message: string): boolean {
    const messageSize = new Blob([message]).size;
    const check = canSendMessage(messageSize);

    if (!check.allowed) {
        console.warn(`Cannot send message: ${check.reason}`);
        createVisualFeedback(check.reason || 'Cannot send message', 'error');
        return false;
    }

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        return true;
    }

    console.warn('WebSocket is not open');
    return false;
}

