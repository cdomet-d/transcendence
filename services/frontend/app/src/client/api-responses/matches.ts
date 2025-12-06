import type { MatchOutcome } from '../web-elements/types-interfaces';
import { redirectOnError } from '../error';
import { router } from '../main';

export function matchOutcomeFromAPIRes(responseObject: any): MatchOutcome {
	if (!responseObject || typeof responseObject !== 'object')
		redirectOnError(router.stepBefore, 'Malformed API response');
	return responseObject as MatchOutcome;
}

export function MatchOutcomeArrayFromAPIRes(responseObject: any): MatchOutcome[] {
	if (!responseObject || typeof responseObject !== 'object')
		redirectOnError(router.stepBefore, 'Malformed API response');

	let matchCollection: MatchOutcome[] = [];
	responseObject.forEach((match: any) => {
		const m = matchOutcomeFromAPIRes(match);
		matchCollection.push(m);
	});
	return matchCollection;
}
