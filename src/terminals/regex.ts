import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse with a regular expression.
 *
 * The pattern is matched with the sticky flag at the current offset, so it is
 * anchored by construction and never scans ahead. A leading `^` is redundant
 * and is stripped.
 *
 * @example
 * regex(/^\w+/)('hello world') // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 */
export const regex = <T = string>(pattern: RegExp, expected?: string) => {
    if (pattern.global) {
        throw new Error('Global flag is not supported in regex parsers');
    }

    const source = pattern.source.startsWith('^')
        ? pattern.source.slice(1)
        : pattern.source;
    const flags = pattern.flags.replace('y', '') + 'y';
    const sticky = new RegExp(source, flags);
    const described = expected ?? `/${source}/`;

    return create<T>((input, index = 0) => {
        sticky.lastIndex = index;
        const match = sticky.exec(input);

        return match
            ? success<T>(match[0] as T, index + match[0].length)
            : failure(index, described);
    });
};
