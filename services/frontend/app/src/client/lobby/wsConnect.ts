import { createLobbyRequest } from './lobby.js';
import { router } from '../main.js';
import { type gameRequest } from '../pong/pong.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        return wsInstance;
    }
    wsInstance = new WebSocket('wss://localhost:8443/api/lobby/');
    return wsInstance;
}

function wsConnect(action: string, format: string) {
    const ws: WebSocket = openWsConnection();

    ws.onopen = () => {
        console.log("Lobby WebSocket connection established!")
        // lobbyCreation or lobbyJoining
        if (action === 'create') {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                wsInstance.send(createLobbyRequest(action, format));
            } else {
                console.log(`Error: WebSocket is not open for ${action}`);
            }
        } else if (action === 'join') {

        }
    }

    ws.onmessage = (message: MessageEvent) => {
        try {
            // LobbyRequest
            const data = JSON.parse(message.data);
            if (data.lobby && (data.lobby === 'created' || data.lobby === 'joined')) {
                console.log(data.lobby, 'lobby successfully!');
                return;
            }

            // GameRequest
            // TODO handle this with Coralie
            const gameRequest: gameRequest = data;
            window.history.pushState({}, '', '/game/match');
            router.loadRoute('/game/match', true);
            console.log("Client ready to connect game: #" + gameRequest.gameID);
            // pong(gameRequest); // ws connect to "/game/match" and send userID + gameID
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
