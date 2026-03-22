import { choice } from '../combinators/choice';
import { map } from '../combinators/map';
import { literal } from './literal';

/**
 * Parse a boolean literal.
 *
 * @example
 * bool('true') // { ok: true, value: true, remaining: '' }
 * bool('false') // { ok: true, value: false, remaining: '' }
 * bool('trueABC') // { ok: true, value: true, remaining: 'ABC' }
 */
export const bool = choice(
    map(literal('true'), () => true),
    map(literal('false'), () => false),
);
