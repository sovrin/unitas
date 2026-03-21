import { type Parser } from '../core/parser';

type Pipe<A, B> = (this: Parser<A>, arg: A) => B;

export function pipe<A, B>(fn1: Pipe<A, B>): Pipe<A, B>;
export function pipe<A, B, C>(fn1: Pipe<A, B>, fn2: Pipe<B, C>): Pipe<A, C>;
export function pipe<A, B, C, D>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
): Pipe<A, D>;
export function pipe<A, B, C, D, E>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
): Pipe<A, E>;
export function pipe<A, B, C, D, E, F>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
): Pipe<A, F>;
export function pipe<A, B, C, D, E, F, G>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
    fn6: Pipe<F, G>,
): Pipe<A, G>;
export function pipe<A, B, C, D, E, F, G, H>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
    fn6: Pipe<F, G>,
    fn7: Pipe<G, H>,
): Pipe<A, H>;
export function pipe<A, B, C, D, E, F, G, H, I>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
    fn6: Pipe<F, G>,
    fn7: Pipe<G, H>,
    fn8: Pipe<H, I>,
): Pipe<A, I>;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
    fn6: Pipe<F, G>,
    fn7: Pipe<G, H>,
    fn8: Pipe<H, I>,
    fn9: Pipe<I, J>,
): Pipe<A, J>;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
    fn1: Pipe<A, B>,
    fn2: Pipe<B, C>,
    fn3: Pipe<C, D>,
    fn4: Pipe<D, E>,
    fn5: Pipe<E, F>,
    fn6: Pipe<F, G>,
    fn7: Pipe<G, H>,
    fn8: Pipe<H, I>,
    fn9: Pipe<I, J>,
    ...fns: Array<Pipe<unknown, unknown>>
): Pipe<unknown, unknown>;

export function pipe(...fns: Array<Pipe<unknown | never, unknown | never>>) {
    return function (this: Parser, value: unknown) {
        return fns.reduce((acc, fn) => fn.bind(this)(acc), value);
    };
}
