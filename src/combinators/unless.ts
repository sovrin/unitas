import type { Parser } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';

export const unless = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        return !condition ? parser(input) : success(null, input);
    });
};
