import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return result ? success(result[0], input) : failure();
    });
};
