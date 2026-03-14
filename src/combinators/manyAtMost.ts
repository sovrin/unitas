import type { Parser } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';

export const manyAtMost = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result) {
                break;
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });
};
