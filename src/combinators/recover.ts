import type { Parser } from '../types';

import { forward } from '../core';
import { create } from '../core/create';
import { success } from '../core/success';

export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(fallback, input);
    });
};
