import type { Parser } from '../types';

import { create } from '../core/create';
import { forward } from '../core/forward';
import { success } from '../core/success';

export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(fallback, input);
    });
};
