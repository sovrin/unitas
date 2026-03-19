import type { Parser } from '../core/parser';

import { forward } from '../core/forward';
import { create } from '../core/parser';
import { success } from '../core/success';

export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(null, input);
    });
};
