import type { tournament, userInfo } from '../gameManager/gameManager.interface.js';

export function tournamentOver(tournament: tournament) {
	patchTournamentToDashboard(tournament);
	// showTournamentWinnerScreen();
}

async function patchTournamentToDashboard(tournament: tournament) {
	const url = `http://dashboard:1515/tournament/${tournament.tournamentID}`;
	try {
		const response: Response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tournament.winnerID),
		});
		if (response.status === 400) {
			console.log(`[DASHBOARD] Bad request`);
			const errorBody = (await response.json()) as { message: string };
			throw { code: 400, message: errorBody.message || '[DASHBOARD] Bad request.' };
		}

		if (response.status === 404) {
			console.log(`[DASHBOARD] Tournament not found`);
			const errorBody = (await response.json()) as { message: string };
			throw { code: 404, message: errorBody.message || '[DASHBOARD] Tournament not found.' };
		}

		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /tournament/${tournament.tournamentID}) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
}
