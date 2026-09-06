import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Fuse multiple string parsers into a single one.
 * The fused parser concatenates all string results.
 *
 * @example
 * fuse(char('a'), char('b'), char('c'))('abc') // { ok: true, value: 'abc', index: 3, furthest: -1, expected: [] }
 * fuse(string('hello'), char(' '), string('world'))('hello world') // { ok: true, value: 'hello world', index: 11, furthest: -1, expected: [] }
 */
export const fuse = <T extends Parser<string>[]>(...parsers: T) => {
    return create<string>((input, index = 0) => {
        let value = '';
        let at = index;
        let trace: Result<unknown> = success(null, index);

        for (const parser of parsers) {
            const parsed: Result<string> = merge(trace, parser(input, at));
            trace = parsed;

            if (!parsed.ok) {
                return parsed;
            }

            value += parsed.value;
            at = parsed.index;
        }

        return merge(trace, success(value, at));
    });
};
