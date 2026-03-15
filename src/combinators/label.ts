import type { Parser } from '../types';

import { create, failure, forward } from '../core';

export const label = <T>(parser: Parser<T>, expected: string): Parser<T> => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure(`expected ${expected}`);
        }

        return forward(result);
    });
};
