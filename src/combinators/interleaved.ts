import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * @example
 * parse items with interleaved separators
 * interleaved(literal('a'), literal(','))('a,a,a') // { ok: true, value: ['a', ',', 'a', ',', 'a'], remaining: '' }
 */
export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) => {
    return create<Array<T | S>>((input) => {
        const firstResult = item(input);
        if (!firstResult.ok) return failure();

        const results: Array<T | S> = [firstResult.value];
        let remaining = firstResult.remaining;

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult.ok) break;

            const nextResult = item(sepResult.remaining);
            if (!nextResult.ok) break;

            results.push(sepResult.value);
            results.push(nextResult.value);
            remaining = nextResult.remaining;
        }

        return success(results, remaining);
    });
};
