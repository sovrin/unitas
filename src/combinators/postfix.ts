import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * @example
 * parse postfix operators (chains atom with operators that return functions)
 * postfix(literal('a'), map(literal('!'), () => (x) => x))('a!') // { ok: true, value: 'a', remaining: '' }
 */
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
