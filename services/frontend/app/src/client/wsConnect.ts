import { router } from '../../main.js';
import { pong } from '../game/pong.js';
import { createGameRequestForm, createLobbyRequestForm, attachGameListener } from './lobby.js';
import type { gameRequest } from '../game/pong.js';
import { createLobbyRequest } from '../../lobby_new.js';

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
        // createLobbyInfo based off which button was clicked


    }

    ws.onmessage = (message: MessageEvent) => {
        try {
            // LobbyRequest
            const data = JSON.parse(message.data);
            if (data.lobby && (data.lobby === 'created' || data.lobby === 'joined')) {
                console.log(data.lobby, 'lobby successfully!');

                const app = document.getElementById('app');
                if (app) {
                    // app.innerHTML = renderLobby();
                    attachGameListener();
                } else {
                    console.log("Error: could not find HTMLElement: 'app'");
                    return;
                }
                return;
            }

            // GameRequest
            const gameRequest: gameRequest = data;
            window.history.pushState({}, '', '/game/match');
            router.loadRoute('/game/match');
            console.log("Client ready to connect game: #" + gameRequest.gameID);
            pong(gameRequest); // ws connect to "/game/match" and send userID + gameID
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

function handleGameStart(format: string) {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        const message = createGameRequestForm(format);
        console.log('Client sending GAME_FORM to GM:\n', message);
        wsInstance.send(message);
    } else {
        console.log('Error: WebSocket is not open for GAME_FORM');
    }
}

function handleLobbyRequest(action: string, format: string): void {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        console.log(`Client sending ${action} request`);
        wsInstance.send(createLobbyRequestForm(action, format));
    } else {
        console.log(`Error: WebSocket is not open for ${action}`);
    }
}

export { wsConnect, handleLobbyRequest, handleGameStart };
