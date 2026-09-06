import { type Parser } from './parser';
import { type Result } from './result';

/**
 * Memoizes a parser so each offset is parsed at most once (packrat caching).
 *
 * Keyed by offset rather than by the remaining input, so entries are cheap and
 * the cache is dropped as soon as a different input is parsed.
 *
 * @example
 * const memoDigits = memoize(digits);
 * memoDigits('123') // { ok: true, value: 123, index: 3, furthest: -1, expected: [] }
 */
export const memoize = <T>(parser: Parser<T>): Parser<T> => {
    let source: string | null = null;
    let cache = new Map<number, Result<T>>();

    return (input, index = 0) => {
        if (input !== source) {
            source = input;
            cache = new Map();
        }

        const cached = cache.get(index);
        if (cached !== undefined) {
            return cached;
        }

        const result = parser(input, index);
        cache.set(index, result);

        return result;
    };
};
