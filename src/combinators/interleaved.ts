import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) => {
    return create<Array<T | S>>((input) => {
        const firstResult = item(input);
        if (!firstResult) return failure();

        const results: Array<T | S> = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult) break;

            const nextResult = item(sepResult[1]);
            if (!nextResult) break;

            results.push(sepResult[0]);
            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });
};
