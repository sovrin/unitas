import { describe, it } from 'vitest';
import { postfix } from './postfix';
import { Parser } from '../types';
import { assertResult, numberParser } from '../../test/utils.test';

describe('postfix', () => {
    const postfixOps: Parser<(value: number) => number> = (input) => {
        if (input.startsWith('!')) {
            return [
                (value) => {
                    let result = 1;
                    for (let i = 2; i <= value; i += 1) {
                        result *= i;
                    }

                    return result;
                },
                input.slice(1),
            ];
        }
        if (input.startsWith('²')) {
            return [(value) => value * value, input.slice(1)];
        }
        return null;
    };

    it('should handle atom without postfix operators', () => {
        const parser = postfix(numberParser, postfixOps);
        const result = parser('5');

        assertResult<number>(result, [5, '']);
    });

    it('should apply single postfix operator', () => {
        const parser = postfix(numberParser, postfixOps);
        {
            const result = parser('5!');

            assertResult<number>(result, [120, '']); // 5! = 120
        }
        {
            const result = parser('3²');

            assertResult<number>(result, [9, '']); // 3² = 9
        }
    });

    it('should apply multiple postfix operators left-to-right', () => {
        const parser = postfix(numberParser, postfixOps);
        const result = parser('3²!');

        assertResult<number>(result, [362880, '']); // (3²)! = 9! = 362880
    });

    it('should fail when atom parser fails', () => {
        const parser = postfix(numberParser, postfixOps);
        const result = parser('abc!');

        assertResult<number>(result);
    });

    it('should handle long chains of postfix operators', () => {
        const parser = postfix(numberParser, postfixOps);
        const result = parser('2²²');

        assertResult<number>(result, [16, '']); // (2²)² = 4² = 16
    });

    it('should stop when no more operators match', () => {
        const parser = postfix(numberParser, postfixOps);
        const result = parser('3!+');

        assertResult<number>(result, [6, '+']); // 3! = 6, stops at +
    });
});
