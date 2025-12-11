import { createVisualFeedback } from "../error";
import { router } from "../main";
import type { gameRequest } from "../pong/pong";
import type { LocalPongSettings, RemotePongSettings } from "../web-elements/forms/pong-settings";

export function handleLobbyEvent(data: any, form?: RemotePongSettings | LocalPongSettings): void {
    console.log(`${data.lobby} lobby ${data.lobbyID} successfully!`);

    switch (data.lobby) {
        case 'created':
            console.log('Lobby created with ID:', data.lobbyID);
            break;

        case 'joined':
            handleLobbyJoined(data);
            break;

        case 'whiteListUpdate':
            handleWhiteListUpdate(data, form);
            break;

        default:
            console.warn('Unhandled lobby event:', data.lobby);
    }
}

export function handleLobbyJoined(data: any): void {
    const validFormInstances = ['1 vs 1', 'remoteForm', 'tournament'];
    
    if (!validFormInstances.includes(data.formInstance)) {
        console.error('Invalid formInstance received:', data.formInstance);
        createVisualFeedback('Invalid lobby type received. Please try again.', 'error');
        return;
    }

    if (!Array.isArray(data.whiteListUsernames)) {
        console.error('Invalid whiteListUsernames format:', data.whiteListUsernames);
        createVisualFeedback('Invalid lobby data received. Please try again.', 'error');
        return;
    }

    if (data.formInstance === '1 vs 1' || data.formInstance === 'remoteForm') {
        router.loadRoute('/quick-remote-lobby', true, undefined, 'invitee', data.whiteListUsernames);
    } else if (data.formInstance === 'tournament') {
        router.loadRoute('/tournament-lobby', true, undefined, 'invitee', data.whiteListUsernames);
    }
}

export function handleWhiteListUpdate(data: any, form?: RemotePongSettings | LocalPongSettings): void {
    if (!form) {
        console.error('FORM UNDEFINED: Cannot update whitelist');
        return;
    }

    if (!Array.isArray(data.whiteListUsernames)) {
        console.error('Invalid whiteListUsernames in update:', data.whiteListUsernames);
        return;
    }

    form.displayUpdatedGuests(data.whiteListUsernames);
}

export function handleGameStart(data: any, ws: WebSocket): void {
    if (!data.gameID || typeof data.gameID !== 'string') {
        console.error('Invalid gameID:', data.gameID);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (!data.opponent || typeof data.opponent !== 'object') {
        console.error('Invalid opponent data:', data.opponent);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (typeof data.remote !== 'boolean') {
        console.error('Invalid remote flag:', data.remote);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (!data.gameSettings || typeof data.gameSettings !== 'object') {
        console.error('Invalid gameSettings:', data.gameSettings);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    const gameRequest: gameRequest = data;
    router.loadRoute('/game', true, gameRequest, undefined, undefined, ws);
}