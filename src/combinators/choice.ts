import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';

export const choice = <T>(...parsers: Parser<T>[]) => {
    return create<T>((input) => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result) {
                return result;
            }
        }

        return failure();
    });
};
