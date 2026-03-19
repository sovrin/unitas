import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
) => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result.ok) return failure();

        return predicate(result.value) ? result : failure();
    });
};
