import { describe, it } from 'vitest';

import type { Parser } from '../core/parser';

import { digits } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { postfix } from './postfix';

describe('postfix', () => {
    const postfixOps: Parser<(value: number) => number> = (
        input,
        index = 0,
    ) => {
        if (input.startsWith('!', index)) {
            return success((value) => {
                let result = 1;
                for (let i = 2; i <= value; i += 1) {
                    result *= i;
                }

                return result;
            }, index + 1);
        }
        if (input.startsWith('²', index)) {
            return success((value) => value * value, index + 1);
        }
        return failure(undefined, index);
    };

    it('should handle atom without postfix operators', () => {
        const parser = postfix(digits, postfixOps);
        const result = parser('5');

        assertSuccess<number>(result, 5, 1);
    });

    it('should apply single postfix operator', () => {
        const parser = postfix(digits, postfixOps);
        {
            const result = parser('5!');

            assertSuccess<number>(result, 120, 2); // 5! = 120
        }
        {
            const result = parser('3²');

            assertSuccess<number>(result, 9, 2); // 3² = 9
        }
    });

    it('should apply multiple postfix operators left-to-right', () => {
        const parser = postfix(digits, postfixOps);
        const result = parser('3²!');

        assertSuccess<number>(result, 362880, 3); // (3²)! = 9! = 362880
    });

    it('should fail when atom parser fails', () => {
        const parser = postfix(digits, postfixOps);
        const result = parser('abc!');

        assertFailure<number>(result);
    });

    it('should handle long chains of postfix operators', () => {
        const parser = postfix(digits, postfixOps);
        const result = parser('2²²');

        assertSuccess<number>(result, 16, 3); // (2²)² = 4² = 16
    });

    it('should stop when no more operators match', () => {
        const parser = postfix(digits, postfixOps);
        const result = parser('3!+');

        assertSuccess<number>(result, 6, 2); // 3! = 6, stops at +
    });
});
