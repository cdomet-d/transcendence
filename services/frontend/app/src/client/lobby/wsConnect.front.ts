import { createVisualFeedback } from '../error.js';
import { router } from '../main.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';
import type { inviteeObj } from './gm.interface.front.js';
import { executeAction, wsSend } from './wsAction.front.js';
import { endGame } from '../web-elements/game/pong-events.js';
import { looseImage, winImage } from '../web-elements/default-values.js';
import { handleGameStart, handleLobbyEvent } from './wsUtils.front.js';
import { handleError } from './wsError.front.js';
import { wsSafeSend } from './wsSend.front.js';

export let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket(`wss://${API_URL}:8443/api/lobby/`);
	return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj, form?: RemotePongSettings | LocalPongSettings) {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) executeAction(wsInstance, action, format, formInstance, lobbyID, gameSettings, invitee);
	let ws: WebSocket;
	if (wsInstance === null) {
		ws = openWsConnection();
		setMessEvent(ws, form);
	} else ws = wsInstance;
	if (form) form.socket = ws;
	ws.onopen = async () => {
		const interval = setInterval(() => {
			if (ws.readyState === ws.OPEN) {
				wsSafeSend(ws, JSON.stringify({ event: 'NOTIF', payload: { notif: 'ping' } }));
			} else clearInterval(interval);
		}, 30000);

		executeAction(ws, action, format, formInstance, lobbyID, gameSettings, invitee);
	};

	if (action === 'invitee' && ws.readyState === WebSocket.OPEN) {
		setMessEvent(ws, form);
		wsSend(ws, JSON.stringify({ event: 'SIGNAL', payload: { signal: 'in lobby' } }));
	}

	ws.onerror = (err: any) => {
		return;
	};

	ws.onclose = (event) => {
		wsInstance = null;
		if (event.code === 4001) {
			const currentRoute = window.location.pathname;
			if (currentRoute.includes('-lobby') || currentRoute === '/game') router.loadRoute('/lobby-menu', true);
		}
	};
}

async function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings) {
	ws.onmessage = (message: MessageEvent) => {
		try {
			const data = JSON.parse(message.data);

			if (data.error) {
				handleError(data.error);
				return;
			}

			if (data.event === 'NOTIF' && data.notif === 'pong') return;

			if (data.lobby) {
				handleLobbyEvent(data, ws, form);
				return;
			}

			if (data.opponent && data.gameID && data.gameSettings !== undefined && typeof data.remote === 'boolean') {
				handleGameStart(data, ws);
				return;
			}

			if (data === 'start') {
				form?.enableStartButton();
				return;
			}

			if (data.event === 'END GAME') {
				if (data.result === 'winner') endGame(winImage, 'winScreen', `${data.username} won !`, data.endLobby);
				else endGame(looseImage, 'looseScreen', `${data.username} lost...`, data.endLobby);
				if (data.endGame === true) wsSend(ws, JSON.stringify({ event: 'SIGNAL', payload: { signal: 'got result' } }));
				else
					setTimeout(() => {
						wsSend(ws, JSON.stringify({ event: 'SIGNAL', payload: { signal: 'got result' } }));
					}, 5000);
			}
		} catch (error) {
			console.error('Error: Failed to parse WS message', error);
			createVisualFeedback('Connection error. Please refresh the page.', 'error');
		}
	};
}

export { wsConnect };
