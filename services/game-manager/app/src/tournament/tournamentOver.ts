import { fetch, Agent } from 'undici';
import type { tournament } from '../manager.interface.js';

export function tournamentOver(tournament: tournament) {
    // const tournament: tournament = JSON.parse(payload);
    patchTournamentToDashboard(tournament);
    // showTournamentWinnerScreen();
}

const sslAgent = new Agent({
    connect: { rejectUnauthorized: false }
});

async function patchTournamentToDashboard(tournament: tournament) {
    const url = `https://dashboard:1515/tournament/:tournamentID}`;
    let response: Response;

    try {
        response = await fetch(url, {
            method: 'PATCH',
            dispatcher: sslAgent,
            body: JSON.stringify(tournament),
        });
    } catch (error) {
        console.error(`[GM] Dashboard service (via route /tournament/:tournamentID) is unreachable: ${error}`);
        throw new Error('Dashboard service is unreachable.');
    }

    // TODO check response status ?

    if (!response.ok) {
        console.error(`[GM] Dashboard service failed with status: ${response.status}`);
        throw new Error(`Dashboard service failed with status ${response.status}`);
    }
}
