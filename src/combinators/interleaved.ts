import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse items separated by separators, keeping both in the result.
 *
 * @example
 * interleaved(digits, char('+'))('1+2') // { ok: true, value: [1, '+', 2], index: 3 }
 */
export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) => {
    return create<Array<T | S>>((input, index = 0, ctx) => {
        const firstResult = item(input, index, ctx);
        if (!firstResult.ok) {
            return firstResult;
        }

        const results: Array<T | S> = [firstResult.value];
        let at = firstResult.index;

        while (true) {
            const sepResult: Result<S> = separator(input, at, ctx);
            if (!sepResult.ok) break;

            const nextResult: Result<T> = item(input, sepResult.index, ctx);
            if (!nextResult.ok) break;

            results.push(sepResult.value);
            results.push(nextResult.value);
            at = nextResult.index;
        }

        return success(results, at);
    });
};
