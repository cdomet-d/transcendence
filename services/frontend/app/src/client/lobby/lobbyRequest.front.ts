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

function createLobbyRequest(action: string, format: string, formInstance: string): string {
    const createLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: 8, // TODO: get uid from JWT
        },
        formInstance: formInstance
    };
    return JSON.stringify(createLobbyForm);
}

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

export { createLobbyRequest, joinLobbyRequest };