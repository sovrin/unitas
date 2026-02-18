import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser } from '../types';

export const postfix = <T>(
    atom: Parser<T>,
    operator: Parser<(value: T) => T>,
) => {
    return create<T>((input) => {
        const atomResult = atom(input);
        if (!atomResult) return failure();

        let [value, remaining] = atomResult;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult) break;
            value = opResult[0](value);
            remaining = opResult[1];
        }

        return success(value, remaining);
    });
};
