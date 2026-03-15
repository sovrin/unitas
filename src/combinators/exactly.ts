import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const exactly = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result.ok) {
                return failure();
            }

            results.push(result.value);
            remaining = result.remaining;
        }

        return success(results, remaining);
    });
};
