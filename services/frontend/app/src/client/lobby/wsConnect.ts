import { createLobbyRequest, joinLobbyRequest } from './lobby.js';
// import { router } from '../main.js';
import { type gameRequest } from '../pong/pong.js';
import { renderGame } from '../render-pages.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        return wsInstance;
    }
    wsInstance = new WebSocket('wss://localhost:8443/api/lobby/');
    return wsInstance;
}

function wsConnect(action: string, format: string, formInstance: string) {
    const ws: WebSocket = openWsConnection();

    ws.onopen = () => {
        console.log("Lobby WebSocket connection established!")
        // createLobby || joinLobby
        if (action === 'create') {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                wsInstance.send(createLobbyRequest(action, format, formInstance));
            } else {
                console.log(`Error: WebSocket is not open for ${action}`);
            }
        } else if (action === 'join') {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                // wsInstance.send(joinLobbyRequest(action, format, lobbyID)); // TODO How do I get lobbyID
            } else {
                console.log(`Error: WebSocket is not open for ${action}`);
            }
        }
    }

    ws.onmessage = (message: MessageEvent) => {
        try {
            // LobbyRequest
            const data = JSON.parse(message.data);
            if (data.lobby && (data.lobby === 'created' || data.lobby === 'joined')) {
                console.log(`${data.lobby} lobby ${data.lobbyID} successfully!`);
                // send lobbyID to Form
                console.log(data.formInstance)
                // updateGameForm(data.formInstance);
                return;
            }

            // GameRequest
            // TODO handle this with Coralie
            const gameRequest: gameRequest = data;
            //
            renderGame(gameRequest);
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
        // TODO: Check wether deconnection was expected or not
    };
}

export { wsConnect };
