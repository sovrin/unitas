import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

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

/**
 * Transform a parsed value through one or more functions.
 *
 * @example
 * map(digits, (n) => n * 2)('21') // { ok: true, value: 42, index: 2 }
 */
export function map<A>(
    parser: Parser<A>,
    ...transforms: Array<(value: unknown) => unknown>
) {
    return create((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);
        if (!result.ok) {
            return result;
        }

        const finalValue = transforms.reduce(
            (acc, fn) => fn(acc),
            result.value as unknown,
        );

        return success(finalValue, result.index);
    });
}
