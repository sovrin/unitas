import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse items separated by separators, keeping both in the result.
 *
 * @example
 * interleaved(digits, char('+'))('1+2') // { ok: true, value: [1, '+', 2], index: 3, furthest: 3, expected: ["'+'"] }
 */
export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) => {
    return create<Array<T | S>>((input, index = 0) => {
        const firstResult = item(input, index);
        if (!firstResult.ok) {
            return firstResult;
        }

        const results: Array<T | S> = [firstResult.value];
        let at = firstResult.index;
        let trace: Result<unknown> = firstResult;

        while (true) {
            const sepResult: Result<S> = merge(trace, separator(input, at));
            trace = sepResult;
            if (!sepResult.ok) break;

            const nextResult: Result<T> = merge(trace, item(input, sepResult.index));
            trace = nextResult;
            if (!nextResult.ok) break;

            results.push(sepResult.value);
            results.push(nextResult.value);
            at = nextResult.index;
        }

        return merge(trace, success(results, at));
    });
};
