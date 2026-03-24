import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Transform the parsed value.
 *
 * @example
 * map(string('hello'), (v) => v.toUpperCase())('hello') // { ok: true, value: 'HELLO', remaining: '' }
 */
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
        if (!result.ok) {
            return failure();
        }

        const finalValue = transforms.reduce(
            (acc, fn) => fn(acc),
            result.value as unknown,
        );

        return success(finalValue, result.remaining);
    });
}
