import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

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
