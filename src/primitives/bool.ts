import { choice } from '../combinators/choice';
import { map } from '../combinators/map';
import { create } from '../core/parser';
import { string } from '../terminals/string';

const parser = choice(
    map(string('true'), () => true),
    map(string('false'), () => false),
);

/**
 * Parse a boolean literal.
 *
 * @example
 * bool('true') // { ok: true, value: true, index: 4, furthest: -1, expected: [] }
 * bool('false') // { ok: true, value: false, index: 5, furthest: 0, expected: ["'true'"] }
 * bool('trueABC') // { ok: true, value: true, index: 4, furthest: -1, expected: [] }
 */
export const bool = create<boolean>(parser);
