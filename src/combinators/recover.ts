import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result ? result : success(fallback, input);
    });
};
