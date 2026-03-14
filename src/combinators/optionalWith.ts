import type { Parser } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';

export const optionalWith = <T>(parser: Parser<T>, defaultValue: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result
            ? success(result[0], result[1])
            : success(defaultValue, input);
    });
};
