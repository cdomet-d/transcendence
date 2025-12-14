import type { PongOptions } from "../web-elements/types-interfaces";

export interface lobbyInviteForm {
    event: 'LOBBY_INVITE',
    payload: {
        action: string,
        format: string,
        invitee: {userID: string, username?: string},
        hostID: string,
    },
}

export interface lobbyJoinForm {
    event: 'LOBBY_JOIN',
    payload: {
        action: string,
        format: string,
        invitee: {userID: string, username?: string},
        lobbyID: string,
    },
}

export interface lobbyDeclineForm {
    event: 'LOBBY_DECLINE',
    payload: {
        action: string,
        invitee: {userID: string, username?: string},
        lobbyID: string,
    },
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
}

export interface gameRequestForm {
    event: 'GAME_REQUEST';
    payload: {
        lobbyID: string,
        hostID: string,
        remote: boolean;
        format: 'quickmatch' | 'tournament' | string;
        nbPlayers: number;
        gameSettings: PongOptions;
    };
}

export interface inviteeObj {
	userID: string, 
	username?: string
}