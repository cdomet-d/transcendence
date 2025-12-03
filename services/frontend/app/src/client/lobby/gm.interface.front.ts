export interface lobbyRequestForm {
    event: 'LOBBY_REQUEST',
    payload: {
        action: string,
        format: string,
        userID: string,
        lobbyID?: string
    },
    formInstance?: string
}

export interface gameRequestForm {
    event: 'GAME_REQUEST';
    payload: {
        userList: userInfo[];
        remote: boolean;
        format: 'quickmatch' | 'tournament' | string;
        nbPlayers: number;
    };
}

interface userInfo {
    userID?: string;
    username?: string;
    userSocket?: WebSocket;
}