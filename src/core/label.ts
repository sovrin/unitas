import type { Parser } from '../types';

import { create } from './create';
import { failure } from './failure';
import { forward } from './forward';

export const label = <T>(parser: Parser<T>, expected: string): Parser<T> => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure(`expected ${expected}`);
        }

        return forward(result);
    });
};
