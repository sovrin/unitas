import { Parser } from './types';
import { create, failure, success } from './core';

export const sequence = <T extends readonly unknown[]>(...parsers: { [K in keyof T]: Parser<T[K]> }) =>
    create<T>((input) => {
        const results: unknown[] = [];
        let remaining = input;

        for (const parser of parsers) {
            const result = parser(remaining);
            if (!result) return failure();
            results.push(result[0]);
            remaining = result[1];
        }

        return success(results as unknown as T, remaining);
    });

export const choice = <T>(...parsers: Parser<T>[]) =>
    create<T>((input) => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result) return result;
        }

        return failure();
    });

export function map<A, B>(parser: Parser<A>, transform: (value: A) => B): Parser<B>;
export function map<A, B, C>(parser: Parser<A>, transform1: (value: A) => B, transform2: (value: B) => C): Parser<C>;
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
export function map<A>(parser: Parser<A>, ...transforms: Array<(value: unknown) => unknown>) {
    return create((input) => {
        const result = parser(input);
        if (!result) return failure();

        const finalValue = transforms.reduce((acc, fn) => fn(acc), result[0] as unknown);
        return success(finalValue, result[1]);
    });
}

export const bind = <A, B>(parser: Parser<A>, f: (a: A) => Parser<B>) =>
    create<B>((input) => {
        const result = parser(input);
        if (!result) return failure();

        return f(result[0])(result[1]);
    });

type PipeFunction<T, U> = (value: T) => U;

export function pipe<A, B>(fn1: PipeFunction<A, B>): PipeFunction<A, B>;
export function pipe<A, B, C>(fn1: PipeFunction<A, B>, fn2: PipeFunction<B, C>): PipeFunction<A, C>;
export function pipe<A, B, C, D>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
): PipeFunction<A, D>;
export function pipe<A, B, C, D, E>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
): PipeFunction<A, E>;
export function pipe<A, B, C, D, E, F>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
): PipeFunction<A, F>;
export function pipe<A, B, C, D, E, F, G>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
    fn6: PipeFunction<F, G>,
): PipeFunction<A, G>;
export function pipe<A, B, C, D, E, F, G, H>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
    fn6: PipeFunction<F, G>,
    fn7: PipeFunction<G, H>,
): PipeFunction<A, H>;
export function pipe<A, B, C, D, E, F, G, H, I>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
    fn6: PipeFunction<F, G>,
    fn7: PipeFunction<G, H>,
    fn8: PipeFunction<H, I>,
): PipeFunction<A, I>;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
    fn6: PipeFunction<F, G>,
    fn7: PipeFunction<G, H>,
    fn8: PipeFunction<H, I>,
    fn9: PipeFunction<I, J>,
): PipeFunction<A, J>;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
    fn1: PipeFunction<A, B>,
    fn2: PipeFunction<B, C>,
    fn3: PipeFunction<C, D>,
    fn4: PipeFunction<D, E>,
    fn5: PipeFunction<E, F>,
    fn6: PipeFunction<F, G>,
    fn7: PipeFunction<G, H>,
    fn8: PipeFunction<H, I>,
    fn9: PipeFunction<I, J>,
    ...fns: Array<PipeFunction<unknown, unknown>>
): PipeFunction<unknown, unknown>;
export function pipe(...fns: Array<PipeFunction<unknown | never, unknown | never>>) {
    return function (value: unknown) {
        return fns.reduce((acc, fn) => fn(acc), value);
    };
}

export const lazy = <T>(thunk: () => Parser<T>) => create<T>((input) => thunk()(input));

export const attempt = <T>(parser: Parser<T>) =>
    create<T>((input) => {
        // In this simple implementation, all parsers are already atomic
        // This is mainly for API compatibility with other parser libraries
        return parser(input);
    });
