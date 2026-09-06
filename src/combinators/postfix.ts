import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Apply zero or more postfix operators to an atom.
 *
 * @example
 * postfix(digits, map(char('!'), () => (n) => n * 2))('3!') // { ok: true, value: 6, index: 2, furthest: 2, expected: ["'!'"] }
 */
export const postfix = <T>(
    atom: Parser<T>,
    operator: Parser<(value: T) => T>,
) => {
    return create<T>((input, index = 0) => {
        const atomResult = atom(input, index);
        if (!atomResult.ok) {
            return atomResult;
        }

        let value = atomResult.value;
        let at = atomResult.index;
        let trace: Result<unknown> = atomResult;

        while (true) {
            const opResult: Result<(value: T) => T> = merge(trace, operator(input, at));
            trace = opResult;
            if (!opResult.ok) break;

            value = opResult.value(value);
            at = opResult.index;
        }

        return merge(trace, success(value, at));
    });
};
