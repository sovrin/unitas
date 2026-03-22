import { type Parser } from '../core/parser';
import { type Result } from './result';

/**
 * Memoizes a parser to cache results by input string.
 * Useful for expensive parsers and recursive grammars to avoid
 * exponential backtracking.
 *
 * @example
 * const memoDigits = memoize(digits);
 * memoDigits('123') // { ok: true, value: 123, remaining: '' }
 */
export const memoize = <T>(parser: Parser<T>): Parser<T> => {
    const cache = new Map<string, Result<T>>();

    return (input) => {
        const cached = cache.get(input);
        if (cached !== undefined) {
            return cached;
        }

        const result = parser(input);
        cache.set(input, result);
        return result;
    };
};
