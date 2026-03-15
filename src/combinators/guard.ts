import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { forward } from '../core/forward';

export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        if (!condition) {
            return failure();
        }

        const result = parser(input);

        return forward(result);
    });
};
