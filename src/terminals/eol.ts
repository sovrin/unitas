import { choice } from '../combinators/choice';
import { map } from '../combinators/map';
import { create } from '../core/parser';
import { crlf } from './crlf';
import { eof } from './eof';
import { nl } from './nl';

/**
 * Parse end of line (\\n, \\r\\n, or EOF).
 *
 * @example
 * eol('\nabc') // { ok: true, value: '\n', remaining: 'abc' }
 */
export const eol = create<string>(
    choice(
        nl,
        crlf,
        map(eof, () => ''),
    ),
);
