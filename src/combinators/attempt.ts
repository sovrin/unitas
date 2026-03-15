import type { Parser } from '../types';

import { create } from '../core/create';
import { forward } from '../core/forward';

export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return forward(result);
    });
};
