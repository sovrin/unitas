import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';

export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        if (!result) {
            return failure();
        }

        return result;
    });
};
