import { InlineMatch } from './matches';
import type { inlineMatchResult } from '../../types-interfaces';

export function createMatchOutcome(match: inlineMatchResult, isHeader: boolean): InlineMatch {
    const el = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
    el.header = isHeader;
    el.match = match;
    return el;
}
