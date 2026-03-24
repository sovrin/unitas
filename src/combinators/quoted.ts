import type { Parser } from '../core/parser';

import { choice } from '../combinators/choice';
import { surrounded } from '../combinators/surrounded';
import { string } from '../terminals/string';

/**
 * Parse content surrounded by single or double quotes.
 *
 * @example
 * quoted(string('hello'))('"hello"') // { ok: true, value: 'hello', remaining: '' }
 */
export const quoted = <T>(content: Parser<T>) => {
    return choice(
        surrounded(string('"'), content),
        surrounded(string("'"), content),
    );
};
