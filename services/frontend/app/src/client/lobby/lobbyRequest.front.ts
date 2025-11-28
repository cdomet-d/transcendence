import { userStatus, type userStatusInfo } from "../main";

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

async function createLobbyRequest(action: string, format: string, formInstance: string): Promise<string> {

    const host: userStatusInfo = await userStatus();
    if (host.auth === false) {
        window.alert("You are not logged in!"); // TODO use redirectOnError(route, message);
        console.log("Error: User token is not valid!");
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
    //     console.log("Error: User token is not valid!");
    //     return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    // }

    const joinLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: 99, // TODO: get uid from 'host'
            lobbyID: lobbyID,
        },
        // formInstance: formInstance
    };

    return JSON.stringify(joinLobbyForm);
}

export { createLobbyRequest, joinLobbyRequest };