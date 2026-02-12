import { create } from '../core/create';
import { Parser } from '../types';
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
            if (!opResult) break;
            operators.push(opResult[0]);
            remaining = opResult[1];
        }

        const atomResult = atom(remaining);
        if (!atomResult) return failure();

        const finalValue = operators.reduceRight(
            (value, op) => op(value),
            atomResult[0],
        );

        return success(finalValue, atomResult[1]);
    });
};
