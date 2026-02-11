import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

export const optionalSkip = <T>(parser: Parser<T>) => {
    return create<void>((input) => {
        const result = parser(input);

        return result
            ? success(undefined, result[1])
            : success(undefined, input);
    });
};
