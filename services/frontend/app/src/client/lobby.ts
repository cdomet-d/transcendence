// import { renderLobbyMenu } from "../../pages/html.pages.js";
import { handleGameStart, handleLobbyRequest } from './wsConnect.js';

interface lobbyInfo {
    userList: userInfo[];
    remote: boolean;
    format: 'quick' | 'tournament' | string;
    nbPlayers: number;
    // gameSettings: gameSettingsObj
}

interface userInfo {
    userID?: number;
    username?: string;
    userSocket?: WebSocket;
}

function lobby() {
    // renderLobbyMenu();
    attachLobbyMenuListeners();
    // import('./wsConnect.js').then(({ wsConnect }) => {
    //     wsConnect();
    // });
}

// FRONT
function attachLobbyMenuListeners() {
    const createQuickBtn = document.getElementById('create-quick-btn');
    const createTournamentBtn = document.getElementById('create-tournament-btn');
    const joinQuickBtn = document.getElementById('join-quick-btn');
    const joinTournamentBtn = document.getElementById('join-tournament-btn');

    if (createQuickBtn) {
        createQuickBtn.addEventListener('click', () => handleLobbyRequest('create', 'quick'));
    }
    if (joinQuickBtn) {
        joinQuickBtn.addEventListener('click', () => handleLobbyRequest('join', 'quick'));
    }
    if (createTournamentBtn) {
        createTournamentBtn.addEventListener('click', () =>
            handleLobbyRequest('create', 'tournament'),
        );
    }
    if (joinTournamentBtn) {
        joinTournamentBtn.addEventListener('click', () => handleLobbyRequest('join', 'tournament'));
    }
}

function attachGameListener() {
    const startTournamentButton = document.getElementById('start-tournament-btn');
    const startQuickmatchButton = document.getElementById('start-quickmatch-btn');

    if (startTournamentButton) {
        startTournamentButton.addEventListener('click', () => handleGameStart('tournament'));
    }

    if (startQuickmatchButton) {
        startQuickmatchButton.addEventListener('click', () => handleGameStart('quick'));
    }
}
// FRONT

interface gameRequestForm {
    event: 'GAME_REQUEST';
    payload: lobbyInfo;
}

function createGameRequestForm(format: string): string {
    const gameRequestForm: gameRequestForm = {
        event: 'GAME_REQUEST',
        payload: {
            format: format,
            remote: true,
            nbPlayers: format === 'quick' ? 2 : 4,
            userList: [ // this a Map now
                { userID: 1, username: 'sam' },
                { userID: 2, username: 'alex' },
                // { userID: 3, username: "cha" },
                // { userID: 4, username: "coco" }
            ],
        },
    };

    return JSON.stringify(gameRequestForm);
}

interface lobbyCreationForm {
    event: 'LOBBY_REQUEST';
    payload: {
        action: 'create' | 'join' | string; // '| string' is for type compatibility
        format: 'quick' | 'tournament' | string;
        lobbyID?: number;
        userID?: number;
    };
}

function createLobbyRequestForm(action: string, format: string): string {
    const lobbyCreationForm: lobbyCreationForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            lobbyID: 99, // TODO: invitation would contain lobbyID
            // userID: , // TODO: get uid from JWT
        },
    };
    return JSON.stringify(lobbyCreationForm);
}

export {
    createGameRequestForm,
    createLobbyRequestForm,
    lobby,
    handleGameStart,
    attachGameListener,
};
