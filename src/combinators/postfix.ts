import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const postfix = <T>(
    atom: Parser<T>,
    operator: Parser<(value: T) => T>,
) => {
    return create<T>((input) => {
        const atomResult = atom(input);
        if (!atomResult.ok) return failure();

        let { value, remaining } = atomResult;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult.ok) break;
            value = opResult.value(value);
            remaining = opResult.remaining;
        }

        return success(value, remaining);
    });
};
