import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const termResult = terminator(remaining);
            if (termResult) {
                break;
            }

            const parseResult = parser(remaining);
            if (!parseResult) {
                return failure();
            }

            results.push(parseResult[0]);
            remaining = parseResult[1];
        }

        return success(results, remaining);
    });
};
