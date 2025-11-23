import { Parser, Success } from './types';
import { failure, success } from './results';

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
