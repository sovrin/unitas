import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input) => {
        const results: unknown[] = [];
        let remaining = input;

        for (const parser of parsers) {
            const result = parser(remaining);
            if (!result.ok) {
                return failure();
            }

            results.push(result.value);
            remaining = result.remaining;
        }

        return success(results as unknown as T, remaining);
    });
};
