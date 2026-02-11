import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result ? success(result[0], result[1]) : success(null, input);
    });
};
