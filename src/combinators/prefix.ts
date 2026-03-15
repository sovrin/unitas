import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const prefix = <T>(
    operator: Parser<(value: T) => T>,
    atom: Parser<T>,
) => {
    return create<T>((input) => {
        const operators: Array<(value: T) => T> = [];
        let remaining = input;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult.ok) break;
            operators.push(opResult.value);
            remaining = opResult.remaining;
        }

        const atomResult = atom(remaining);
        if (!atomResult.ok) return failure();

        const finalValue = operators.reduceRight(
            (value, op) => op(value),
            atomResult.value,
        );

        return success(finalValue, atomResult.remaining);
    });
};
