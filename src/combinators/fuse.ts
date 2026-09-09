import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Fuse multiple string parsers into a single one.
 * The fused parser concatenates all string results.
 *
 * @example
 * fuse(char('a'), char('b'), char('c'))('abc') // { ok: true, value: 'abc', index: 3 }
 * fuse(string('hello'), char(' '), string('world'))('hello world') // { ok: true, value: 'hello world', index: 11 }
 */
export const fuse = <T extends Parser<string>[]>(...parsers: T) => {
    return create<string>((input, index = 0, ctx) => {
        let value = '';
        let at = index;

        for (const parser of parsers) {
            const parsed: Result<string> = parser(input, at, ctx);
            if (!parsed.ok) {
                return parsed;
            }

            value += parsed.value;
            at = parsed.index;
        }

        return success(value, at);
    });
};
