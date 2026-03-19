import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return result.ok ? success(result.value, input) : failure();
    });
};
