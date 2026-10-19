import { type Context, context, record } from './context';
import { type Parser } from './parser';
import { type Result } from './result';

type Entry<T> = {
    result: Result<T>;
    furthest: number;
    expected: readonly string[];
};

/**
 * Memoizes a parser so each offset is parsed at most once (packrat caching).
 *
 * The cache is keyed by offset and cleared whenever the parser is called with a
 * different input string. Each entry also stores what the parse expected, so a
 * cache hit contributes the same expectations to the error message as a fresh
 * parse would.
 *
 * @example
 * const memoDigits = memoize(digits);
 * memoDigits('123') // { ok: true, value: 123, index: 3 }
 */
export const memoize = <T>(parser: Parser<T>): Parser<T> => {
    let source: string | null = null;
    let cache = new Map<number, Entry<T>>();

    return (input, index = 0, ctx?: Context) => {
        if (input !== source) {
            source = input;
            cache = new Map();
        }

        const cached = cache.get(index);
        if (cached !== undefined) {
            if (cached.furthest >= 0) {
                record(ctx, cached.furthest, cached.expected);
            }

            return cached.result;
        }

        const probe = context();
        const result = parser(input, index, probe);
        cache.set(index, {
            result,
            furthest: probe.furthest,
            expected: probe.expected,
        });

        if (probe.furthest >= 0) {
            record(ctx, probe.furthest, probe.expected);
        }

        return result;
    };
};
