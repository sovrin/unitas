import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';

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
