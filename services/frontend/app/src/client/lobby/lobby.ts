interface lobbyInfo {
    userList: userInfo[];
    remote: boolean;
    format: 'quickmatch' | 'tournament' | string;
    nbPlayers: number;
    // gameSettings: gameSettingsObj
}

interface userInfo {
    userID?: number;
    username?: string;
    userSocket?: WebSocket;
}

interface gameRequestForm {
    event: 'GAME_REQUEST';
    payload: lobbyInfo;
}

// NO
function createGameRequest(format: string, formInstance: string, gameSettings: string): string {
        console.log("3");

    const customSettings = JSON.parse(gameSettings);
    const localOpponent: string | undefined = customSettings.opponent;
    // console.log("OPPONENT: ", localOpponent);

    const gameRequestForm: gameRequestForm = {
        event: 'GAME_REQUEST',
        payload: {
            format: format,
            remote: formInstance === 'localForm' ? false : true,
            nbPlayers: format === 'quickmatch' ? 2 : 4,
            userList: [ // this a Map now
                { userID: 7, username: 'waka' },
                localOpponent !== undefined ? { userID: -1 /* uid will become 'temporary' */, username: localOpponent } : { userID: 2, username: 'alex' }, // TODO differentiate local, remote, tournament
                // { userID: 3, username: "cha" },
                // { userID: 4, username: "coco" }
            ],
        },
    };

    // console.log("localOpponent: ", gameRequestForm.payload.userList);

    return JSON.stringify(gameRequestForm);
}


// YES
interface lobbyRequestForm {
    event: string,
    payload: {
        action: string,
        format: string,
        userID: number,
        lobbyID?: string
    },
    formInstance?: string
}

// YES
function createLobbyRequest(action: string, format: string, formInstance: string): string {
    const createLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: 7, // TODO: get uid from JWT
        },
        formInstance: formInstance
    };
    return JSON.stringify(createLobbyForm);
}

// YES
function joinLobbyRequest(action: string, format: string, lobbyID: string) {
    const joinLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: 99, // TODO: get uid from JWT
            lobbyID: lobbyID,
        },
        // formInstance: formInstance
    };
    return JSON.stringify(joinLobbyForm);
}

export { createGameRequest, createLobbyRequest, joinLobbyRequest };
