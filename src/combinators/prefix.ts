import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Apply zero or more prefix operators to an atom.
 *
 * @example
 * prefix(map(char('-'), () => (n) => -n), digits)('-3') // { ok: true, value: -3, index: 2 }
 */
export const prefix = <T>(
    operator: Parser<(value: T) => T>,
    atom: Parser<T>,
) => {
    return create<T>((input, index = 0, ctx) => {
        const operators: Array<(value: T) => T> = [];
        let at = index;

        while (true) {
            const opResult: Result<(value: T) => T> = operator(input, at, ctx);
            if (!opResult.ok) break;

            operators.push(opResult.value);
            at = opResult.index;
        }

        const atomResult = atom(input, at, ctx);
        if (!atomResult.ok) {
            return atomResult;
        }

        const finalValue = operators.reduceRight(
            (value, op) => op(value),
            atomResult.value,
        );

        return success(finalValue, atomResult.index);
    });
};
