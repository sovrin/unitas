import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { forward } from '../core/forward';

export const choice = <T>(...parsers: Parser<T>[]) => {
    return create<T>((input) => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result.ok) {
                return forward(result);
            }
        }

        return failure();
    });
};
