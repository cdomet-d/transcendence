import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";

interface lobbyRequestForm {
    event: string,
    payload: {
        action: string,
        format: string,
        userID: string,
        lobbyID?: string
    },
    formInstance?: string
}

async function createLobbyRequest(action: string, format: string, formInstance: string): Promise<string> {

    const host: userStatusInfo = await userStatus();
    if (!host.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

    const createLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: host.userID!,
        },
        formInstance: formInstance
    };

    return JSON.stringify(createLobbyForm);
}

function joinLobbyRequest(action: string, format: string, lobbyID: string) {

    // const host: userStatusInfo = await userStatus();
    // if (host.auth === false) {
    // redirectOnError('/auth', 'You must be registered to see this page')
    //     return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    // }

    const joinLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: "temporary", // TODO: get uid from 'host'
            lobbyID: lobbyID,
        },
        // formInstance: formInstance
    };

    return JSON.stringify(joinLobbyForm);
}

export { createLobbyRequest, joinLobbyRequest };