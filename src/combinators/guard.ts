import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        return condition ? parser(input) : success(null, input);
    });
};
