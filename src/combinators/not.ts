import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export const not = <T>(parser: Parser<T>) => {
    return create<null>((input) => {
        const result = parser(input);

        return result.ok ? failure() : success(null, input);
    });
};
