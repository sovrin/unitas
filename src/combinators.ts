import { First, Last, Nth, Parser, Success } from './types';
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
            if (!result) {
                break;
            }

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

        const [more, rest] = many(parser)(required[1])!;

        return success([...required[0], ...more], rest);
    });
};

export const manyBetween = <T>(parser: Parser<T>, min: number, max: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, min)(input);
        if (!required) {
            return failure();
        }

        const [more, rest] = manyAtMost(parser, max - min)(required[1])!;

        return success([...required[0], ...more], rest);
    });
};

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

export const surrounded = <T>(delimiter: Parser, content: Parser<T>) => {
    return create<T>(middle(delimiter, content, delimiter));
};

export const first = <T extends readonly unknown[]>(
    parser: Parser<T>,
): Parser<First<T>> => {
    return create<First<T>>(map(parser, (arr) => arr[0] as First<T>));
};

export const last = <T extends readonly [unknown, ...unknown[]]>(
    parser: Parser<T>,
) => {
    return create<Last<T>>(
        map(parser, (arr) => arr[arr.length - 1] as Last<T>),
    );
};

export const nth = <T extends readonly unknown[], N extends number>(
    parser: Parser<T>,
    index: N,
): Parser<Nth<T, N>> => {
    return create<Nth<T, N>>(map(parser, (arr) => arr[index] as Nth<T, N>));
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

/**
 * zero or more
 */
export const separatedBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const firstResult = parser(input);
        if (!firstResult) {
            return success([], input);
        }

        const results = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult) break;

            const nextResult = parser(sepResult[1]);
            if (!nextResult) {
                // If separator matched but parser failed, backtrack
                // Don't consume the separator
                break;
            }

            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });
};

/**
 * one or more
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        if (values.length === 0) return failure();

        return success(values, remaining);
    });
};

/**
 * one or more
 */
export const separatedEndBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy1(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });
};

/**
 * zero or more
 * consumes the separator even if there is no following match
 */
export const separatedEndBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });
};

/**
 * zero or more
 */
export const endBy = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many(map(sequence(parser, terminator), ([value]) => value)),
    );
};

/**
 * one or more
 */
export const endBy1 = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many1(map(sequence(parser, terminator), ([value]) => value)),
    );
};

export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) => {
    return create<Array<T | S>>((input) => {
        // Must start with an item
        const firstResult = item(input);
        if (!firstResult) return success([], input);

        const results: Array<T | S> = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            // Try separator
            const sepResult = separator(remaining);
            if (!sepResult) break;

            // Try next item after separator
            const nextResult = item(sepResult[1]);
            if (!nextResult) break; // No trailing separators allowed

            // Both separator and item succeeded
            results.push(sepResult[0]);
            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });
};

export const delimited = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input) => {
        const items = separatedBy(parser, separator)(input);
        if (!items) return failure();

        const term = terminator(items[1]);
        return term ? success(items[0], term[1]) : failure();
    });
};

/**
 * parses zero or more occurrences of parser (left-to-right)
 * never fails
 * on zero matches, returns the initial value
 */
export const fold = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const [items, rest] = many(parser)(input) as Success<T[]>;

        return success(items.reduce(folder, initial), rest);
    });
};

/**
 * parses one or more occurrences of parser (left-to-right)
 * fails if there are no matches
 * on success, folds all items (plus the initial) with the folder
 */
export const fold1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const first = parser(input);
        if (!first) {
            return failure();
        }

        const [firstValue, rest] = first;

        let acc = folder(initial, firstValue);

        const [items, finalRest] = many(parser)(rest) as Success<T[]>;
        acc = items.reduce(folder, acc);

        return success(acc, finalRest);
    });
};

/**
 * parses zero or more occurrences of parser (right-to-left)
 * never fails
 * on zero matches, returns the initial value
 */
export const foldRight = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const [items, rest] = many(parser)(input) as Success<T[]>;

        return success(items.reduceRight(folder, initial), rest);
    });
};

/**
 * parses one or more occurrences of parser (right-to-left)
 * fails if there are no matches
 * on success, folds all items (plus the initial) with the folder
 */
export const foldRight1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const first = parser(input);
        if (!first) {
            return failure();
        }

        const [firstValue, rest] = first;
        const [items, finalRest] = many(parser)(rest) as Success<T[]>;

        const all = [firstValue, ...items];
        const folded = all.reduceRight(folder, initial);

        return success(folded, finalRest);
    });
};

export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return result ? success(result[0], input) : failure();
    });
};

export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        return condition ? parser(input) : success(null, input);
    });
};

export const unless = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        return !condition ? parser(input) : success(null, input);
    });
};

export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result ? result : success(fallback, input);
    });
};

export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
) => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result) return failure();

        return predicate(result[0]) ? result : failure();
    });
};
