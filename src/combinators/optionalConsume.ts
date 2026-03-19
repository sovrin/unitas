import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

export const optionalConsume = <T>(parser: Parser<T>) => {
    return create<void>((input) => {
        const result = parser(input);

        return result.ok
            ? success(undefined, result.remaining)
            : success(undefined, input);
    });
};
