import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Apply zero or more prefix operators to an atom.
 *
 * @example
 * prefix(map(char('-'), () => (n) => -n), digits)('-3') // { ok: true, value: -3, index: 2, furthest: 1, expected: ["'-'"] }
 */
export const prefix = <T>(
    operator: Parser<(value: T) => T>,
    atom: Parser<T>,
) => {
    return create<T>((input, index = 0) => {
        const operators: Array<(value: T) => T> = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        while (true) {
            const opResult: Result<(value: T) => T> = merge(trace, operator(input, at));
            trace = opResult;
            if (!opResult.ok) break;

            operators.push(opResult.value);
            at = opResult.index;
        }

        const atomResult = merge(trace, atom(input, at));
        if (!atomResult.ok) {
            return atomResult;
        }

        const finalValue = operators.reduceRight(
            (value, op) => op(value),
            atomResult.value,
        );

        return merge(atomResult, success(finalValue, atomResult.index));
    });
};
