import type { Parser } from '../types';

import { forward } from '../core';
import { create } from '../core/create';
import { success } from '../core/success';

export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(null, input);
    });
};
