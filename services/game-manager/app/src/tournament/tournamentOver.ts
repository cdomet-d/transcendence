import type { tournament, userInfo } from '../gameManager/gameManager.interface.js';

export function tournamentOver(tournament: tournament) {
	patchTournamentToDashboard(tournament);
}
	
async function patchTournamentToDashboard(tournament: tournament) {
	const url = `http://dashboard:1515/tournament/${tournament.tournamentID}`;
	try {
		const response: Response = await fetch(url, {
			method: 'PATCH',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(tournament.winnerID),
		});
		// TODO check response status ?	
		if (!response.ok) {
			console.error(`[GM] Dashboard service failed with status: ${response.status}`);
			throw new Error(`Dashboard service failed with status ${response.status}`);
		}
	} catch (error) {
		console.error(`[GM] Dashboard service (via route /tournament/${tournament.tournamentID}) is unreachable: ${error}`);
		throw new Error('Dashboard service is unreachable.');
	}
}
