import type { Parser } from '../core/parser';

import { forward } from '../core/forward';
import { create } from '../core/parser';

export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return forward(result);
    });
};
