import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';

export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
) => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result) return failure();

        return predicate(result[0]) ? result : failure();
    });
};
