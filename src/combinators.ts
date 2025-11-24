import { Parser, Success } from './types';
import { failure, success } from './results';
import { literal, regex } from './terminals';

export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input) => {
        const results: unknown[] = [];
        let remaining = input;

        for (const parser of parsers) {
            const result = parser(remaining);
            if (!result) {
                return failure();
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results as unknown as T, remaining);
    });
};

export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return (input) => {
        return parserFn(input);
    };
};
export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};

export const choice = <T>(...parsers: Parser<T>[]) => {
    return create<T>((input) => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result) {
                return result;
            }
        }

        return failure();
    });
};

export function map<A, B>(
    parser: Parser<A>,
    transform: (value: A) => B,
): Parser<B>;
export function map<A, B, C>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
): Parser<C>;
export function map<A, B, C, D>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
): Parser<D>;
export function map<A, B, C, D, E>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
): Parser<E>;
export function map<A, B, C, D, E, F>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
    transform5: (value: E) => F,
): Parser<F>;
export function map<A, B, C, D, E, F, G>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
    transform5: (value: E) => F,
    transform6: (value: F) => G,
): Parser<G>;
export function map<A, B, C, D, E, F, G, H>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
    transform5: (value: E) => F,
    transform6: (value: F) => G,
    transform7: (value: G) => H,
): Parser<H>;
export function map<A, B, C, D, E, F, G, H, I>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
    transform5: (value: E) => F,
    transform6: (value: F) => G,
    transform7: (value: G) => H,
    transform8: (value: H) => I,
): Parser<I>;
export function map<A, B, C, D, E, F, G, H, I, J>(
    parser: Parser<A>,
    transform1: (value: A) => B,
    transform2: (value: B) => C,
    transform3: (value: C) => D,
    transform4: (value: D) => E,
    transform5: (value: E) => F,
    transform6: (value: F) => G,
    transform7: (value: G) => H,
    transform8: (value: H) => I,
    transform9: (value: I) => J,
): Parser<J>;
export function map<A>(
    parser: Parser<A>,
    ...transforms: Array<(value: unknown) => unknown>
) {
    return create((input) => {
        const result = parser(input);
        if (!result) {
            return failure();
        }

        const finalValue = transforms.reduce(
            (acc, fn) => fn(acc),
            result[0] as unknown,
        );

        return success(finalValue, result[1]);
    });
}

/**
 * zero or more occurrences
 */
export const many = <T>(parser: Parser<T>) => {
    return create<T[]>((input): Success<T[]> => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const result = parser(remaining);
            if (!result) break;

            // Prevent infinite loop: ensure progress is made
            if (result[1] === remaining) {
                break;
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });
};

/**
 * one or more occurrences with failure on zero
 */
export const many1 = <T>(parser: Parser<T>) => {
    return create<T[]>((input) => {
        const result = parser(input);
        if (!result) {
            return failure();
        }

        const restResults = many(parser)(result[1]);

        return restResults
            ? success([result[0], ...restResults[0]], restResults[1])
            : failure();
    });
};

export const manyAtMost = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result) {
                break;
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });
};

export const manyAtLeast = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, n)(input);
        if (!required) {
            return failure();
        }

        const additional = many(parser)(required[1]);
        if (!additional) {
            return failure();
        }

        return success([...required[0], ...additional[0]], additional[1]);
    });
};

export const manyBetween = <T>(parser: Parser<T>, min: number, max: number) =>
    create<T[]>((input) => {
        const required = exactly(parser, min)(input);
        if (!required) {
            return failure();
        }

        const additional = manyAtMost(parser, max - min)(required[1]);
        if (!additional) {
            return failure();
        }

        return success([...required[0], ...additional[0]], additional[1]);
    });

export const exactly = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result) {
                return failure();
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });
};

export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result ? success(result[0], result[1]) : success(null, input);
    });
};

export const optionalSkip = <T>(parser: Parser<T>) => {
    return create<void>((input) => {
        const result = parser(input);

        return result
            ? success(undefined, result[1])
            : success(undefined, input);
    });
};

export const optionalWith = <T>(parser: Parser<T>, defaultValue: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result
            ? success(result[0], result[1])
            : success(defaultValue, input);
    });
};

export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<A>(map(sequence(parserA, parserB), ([a]) => a));
};

export const right = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<B>(map(sequence(parserA, parserB), ([, b]) => b));
};

export const middle = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<B>(map(sequence(parserA, parserB, parserC), ([, b]) => b));
};

export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const termResult = terminator(remaining);
            if (termResult) {
                break;
            }

            const parseResult = parser(remaining);
            if (!parseResult) {
                return failure();
            }

            results.push(parseResult[0]);
            remaining = parseResult[1];
        }

        return success(results, remaining);
    });
};

export const lexeme = <T>(parser: Parser<T>) => {
    return create<T>(map(sequence(parser, regex(/^\s*/)), ([value]) => value));
};

export const token = <T extends string>(str: T): Parser<T> => {
    return create<T>(lexeme(literal(str)));
};
