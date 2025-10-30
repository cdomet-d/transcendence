import { InlineMatch } from './matches';
import type { matchOutcome } from '../../types-interfaces';

export function createMatchOutcome(match: matchOutcome): InlineMatch {
    const el = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
    el.match = match;
    return el;
}
