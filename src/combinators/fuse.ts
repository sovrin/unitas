import { create, type Parser } from '../core/parser';
import { success } from '../core/success';

/**
 * Fuse multiple string parsers into a single one.
 * The fused parser concatenates all string results.
 *
 * @example
 * fuse(char('a'), char('b'), char('c'))('abc') // { ok: true, value: 'abc', remaining: '' }
 * fuse(string('hello'), char(' '), string('world'))('hello world') // { ok: true, value: 'hello world', remaining: '' }
 */
export const fuse = <T extends Parser<string>[]>(...parsers: T) => {
    return create<string>((input) => {
        let result = '';
        let remaining = input;

        for (const parser of parsers) {
            const parsed = parser(remaining);
            if (!parsed.ok) {
                return { ok: false };
            }
            result += parsed.value;
            remaining = parsed.remaining;
        }

        return success(result, remaining);
    });
};
