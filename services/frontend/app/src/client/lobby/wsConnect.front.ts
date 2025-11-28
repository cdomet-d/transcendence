import { router } from '../main.js';
import { createGameRequest } from './gameRequest.front.js';
import { createLobbyRequest } from './lobbyRequest.front.js';
import { type gameRequest } from '../pong/pong.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        return wsInstance;
    }
    wsInstance = new WebSocket('wss://localhost:8443/api/lobby/');
    return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string) {
    const ws: WebSocket = openWsConnection();

    ws.onopen = () => {
        console.log("Lobby WebSocket connection established!")
        // send Lobby Request
        if (action === 'create') {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                wsInstance.send(createLobbyRequest(action, format, formInstance));
            } else {
                console.log(`Error: WebSocket is not open for ${action}`);
            }
        } else if (action === 'join') {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                // wsInstance.send(joinLobbyRequest(action, format, lobbyID)); // TODO Lobby invites are processed here
            } else {
                console.log(`Error: WebSocket is not open for ${action}`);
            }
        }

    }

    // send Game Request
    if (action === 'game') {
        console.log("2");
        if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
            wsInstance.send(createGameRequest(format, formInstance, gameSettings!));
        } else {
            console.log(`Error: WebSocket is not open for ${action}`);
        }
    }

    ws.onmessage = (message: MessageEvent) => {
        try {
            // handle Response for lobbyRequest
            console.log("8");

            const data = JSON.parse(message.data);
            if (data.lobby && (data.lobby === 'created' || data.lobby === 'joined')) {
                console.log(`${data.lobby} lobby ${data.lobbyID} successfully!`);
                // send lobbyID to Form
                console.log(data.formInstance)
                // updateGameForm(data.formInstance);
                return;
            }

            // handle Response for gameRequest
            console.log("9");

            const gameRequest: gameRequest = data;
            // verify gameRequest content before rendering PONG
            console.log("IN WS CONNECT GameRequest =>", gameRequest);
            router.loadRoute('/game', true, gameRequest);
        } catch (error) {
            console.error("Error: Failed to parse WS message", error);
        }
    }

    ws.onerror = (err: any) => {
        console.log('Error:', err);
        return;
    };

    ws.onclose = () => {
        console.log('Lobby WebSocket connection closed!');
        // TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP 
        // TODO: Check wether deconnection was expected or not
    };
}

export { wsConnect };
