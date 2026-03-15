import type { Parser } from '../types';

import { create, forward } from '../core';

export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return forward(result);
    });
};
