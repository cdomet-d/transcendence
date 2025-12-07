import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";
import type { PongOptions } from "../web-elements/types-interfaces";
import type { gameRequestForm } from "./gm.interface.front";

async function createGameRequest(format: string, formInstance: string, gameSettings: string): Promise<string> {
    const customSettings: PongOptions = JSON.parse(gameSettings);
    // console.log("FORM: ", formInstance); // will be useful at some point

	const host: userStatusInfo = await userStatus();
	if (!host.auth) {
		redirectOnError('/auth', 'You must be registered to see this page');
		return JSON.stringify({ event: 'BAD_USER_TOKEN' });
	}

	const gameRequestForm: gameRequestForm = {
		event: 'GAME_REQUEST',
		payload: {
			hostID: host.userID!,
			format: format,
			remote: formInstance === 'localForm' ? false : true,
			nbPlayers: format === 'quickmatch' ? 2 : 4,
			gameSettings: customSettings
		},
	};

	return JSON.stringify(gameRequestForm);
}

export { createGameRequest };