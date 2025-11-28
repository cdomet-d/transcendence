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

function createGameRequest(format: string, formInstance: string, gameSettings: string): string {
        console.log("3");

    const customSettings = JSON.parse(gameSettings);
    const localOpponent: string | undefined = customSettings.opponent;
    console.log("FORM: ", formInstance);

    const gameRequestForm: gameRequestForm = {
        event: 'GAME_REQUEST',
        payload: {
            format: format,
            remote: formInstance === 'localForm' ? false : true,
            nbPlayers: format === 'quickmatch' ? 2 : 4,
            userList: [
                { userID: 8, username: 'waka' }, // TODO const status = await userStatus /*  */ // WHAT IS THIS STATUS FOR AGAIN?
                localOpponent !== undefined ? 
                    { userID: -1 /* uid will become 'temporary' */, username: localOpponent } : { userID: 2, username: 'alex' }, // TODO add remote user once we have operational Notifications
                
                // { userID: 3, username: "cha" }, // TODO add more users for tournaments once we have operational Notifications
                // { userID: 4, username: "coco" } // TODO add more users for tournaments once we have operational Notifications
            ],
        },
    };

    return JSON.stringify(gameRequestForm);
}

export { createGameRequest };