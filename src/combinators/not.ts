import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const not = <T>(parser: Parser<T>) => {
    return create<null>((input) => {
        const result = parser(input);

        return result ? failure() : success(null, input);
    });
};
