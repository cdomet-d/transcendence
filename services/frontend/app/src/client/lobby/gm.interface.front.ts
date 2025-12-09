import type { PongOptions } from "../web-elements/types-interfaces";

export interface lobbyInviteForm {
    event: 'LOBBY_INVITE',
    payload: {
        action: string,
        format?: string,
        invitee: {userID: string, username?: string},
        lobbyID?: string,
        hostID?: string,
    },
    formInstance?: string
}


export interface lobbyRequestForm {
    event: 'LOBBY_REQUEST',
    payload: {
        action: string,
        format: string,
        userID: string,
        username: string,
        lobbyID?: string
    },
    formInstance?: string
}

export interface gameRequestForm {
    event: 'GAME_REQUEST';
    payload: {
        // userList: userInfo[];
        hostID: string,
        remote: boolean;
        format: 'quickmatch' | 'tournament' | string;
        nbPlayers: number;
        gameSettings: PongOptions;
    };
}

interface userInfo {
    userID?: string;
    username?: string;
    userSocket?: WebSocket;
}