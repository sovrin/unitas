import type { Parser } from '../core/parser';

import { choice } from '../combinators/choice';
import { surrounded } from '../combinators/surrounded';
import { literal } from '../terminals/literal';

/**
 * @example
 * parse content surrounded by single or double quotes
 * quoted(literal('hello'))('"hello"') // { ok: true, value: 'hello', remaining: '' }
 */
export const quoted = <T>(content: Parser<T>) => {
    return choice(
        surrounded(literal('"'), content),
        surrounded(literal("'"), content),
    );
};
