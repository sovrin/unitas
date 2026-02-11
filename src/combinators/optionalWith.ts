import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

export const optionalWith = <T>(parser: Parser<T>, defaultValue: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result
            ? success(result[0], result[1])
            : success(defaultValue, input);
    });
};
