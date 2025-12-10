import type { MatchOutcome } from '../web-elements/types-interfaces';
import { redirectOnError } from '../error';
import { router } from '../main';

export function matchOutcomeFromAPIRes(res: any): MatchOutcome {
	if (!res || typeof res !== 'object') redirectOnError(router.stepBefore, 'Malformed API response');
	if (res.hasOwnProperty('duration') && typeof res.duration === 'string') {
		const trimmedDuration = res.duration.slice(0, 7);
		res.duration = trimmedDuration;
	}
	if (res.hasOwnProperty('date')) {
		console.log('[DATE TYPE]:', typeof res.date,'[DATE VALUE]:', res.date);
	}
	return res as MatchOutcome;
}

export function MatchOutcomeArrayFromAPIRes(responseObject: any): MatchOutcome[] {
	if (!responseObject || typeof responseObject !== 'object') redirectOnError(router.stepBefore, 'Malformed API response');

	let matchCollection: MatchOutcome[] = [];
	responseObject.forEach((match: any) => {
		const m = matchOutcomeFromAPIRes(match);
		if (m.score.includes('-1')) m.score = m.score.replace('-1', 'F');
		matchCollection.push(m);
	});
	return matchCollection;
}
