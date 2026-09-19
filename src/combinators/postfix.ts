import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Apply zero or more postfix operators to an atom.
 *
 * @example
 * postfix(digits, map(char('!'), () => (n) => n * 2))('3!') // { ok: true, value: 6, index: 2 }
 */
export const postfix = <T>(
    atom: Parser<T>,
    operator: Parser<(value: T) => T>,
) => {
    return create<T>((input, index = 0, ctx) => {
        const atomResult = atom(input, index, ctx);
        if (!atomResult.ok) {
            return atomResult;
        }

        let value = atomResult.value;
        let at = atomResult.index;

        while (true) {
            const opResult: Result<(value: T) => T> = operator(input, at, ctx);
            if (!opResult.ok) break;

            value = opResult.value(value);
            at = opResult.index;
        }

        return success(value, at);
    });
};
