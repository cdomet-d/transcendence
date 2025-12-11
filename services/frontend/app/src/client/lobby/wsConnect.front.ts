import { createVisualFeedback } from '../error.js';
import { router } from '../main.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';
import { origin } from '../main.js'
import type { inviteeObj } from './gm.interface.front.js';
import { executeAction } from './wsAction.front.js';
import { handleGameStart, handleLobbyEvent } from './wsUtils.front.js';
import { handleError } from './wsError.front.js';

export let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket(`wss://${origin}:8443/api/lobby/`);
	return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj, form?: RemotePongSettings | LocalPongSettings) {
	const ws: WebSocket = openWsConnection();

	if (form)
		form.socket = ws;

	ws.onopen = async () => {
		console.log('Lobby WebSocket connection established!')

		setMessEvent(ws, form);

		const interval = setInterval(() => {
			if (ws.readyState === ws.OPEN) {
				ws.send(JSON.stringify({ event: "NOTIF", payload: { notif: "ping" } }));
			} else clearInterval(interval);
		}, 30000);

		executeAction(action, format, formInstance, lobbyID, gameSettings, invitee);
	}

	if (action === 'invitee' && ws.OPEN)//TODO: ws OPEN necessary ?
		setMessEvent(ws, form);

	// TODO give socket to executeAction() to avoid duplicate instructions
	executeAction(action, format, formInstance, lobbyID, gameSettings, invitee);

	ws.onerror = (err: any) => {
		console.log('Error:', err);
		return;
	};

	ws.onclose = (event) => {
		wsInstance = null;
		console.log('Lobby WebSocket connection closed!');
		if (event.code === 4001) {
			const currentRoute = window.location.pathname;
			if (currentRoute.includes("-lobby"))
				router.loadRoute('/lobby-menu', true);
		}
		// TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP // 'delete' action ? Handle in GM?
		// TODO: Check wether deconnection was expected or not
	};
}

function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings): void {
    ws.onmessage = (message: MessageEvent) => {
        try {
            const data = JSON.parse(message.data);

            if (data.error) {
                handleError(data.error);
                return;
            }

            if (data.event === 'NOTIF' && data.notif === 'pong') {
                return;
            }

            if (data.lobby) {
                handleLobbyEvent(data, form);
                return;
            }

            if (data.opponent && data.gameID && data.gameSettings !== undefined && typeof data.remote === 'boolean') {
                handleGameStart(data, ws);
                return;
            }

            console.warn('Unhandled WebSocket message type:', data);

        } catch (error) {
            console.error('Error: Failed to parse WS message', error);
            createVisualFeedback('Connection error. Please refresh the page.', 'error');
        }
    };
}


export { wsConnect };
