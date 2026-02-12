import { describe, it } from 'vitest';
import { rightAssoc } from './rightAssoc';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { leftAssoc } from './leftAssoc';
import { assertResult } from '../../test/utils.test';

describe('rightAssoc', () => {
    const numberParser = create<number>((value: string) => {
        const [, match, rest] = value.match(/^(\d+)(.*)/) || ['0'];
        if (!match) return failure();

        return success<number>(parseInt(match), rest);
    });

    const operatorParser = create((input) => {
        const ops: Record<string, (left: number, right: number) => number> = {
            '+': (left, right) => left + right,
            '-': (left, right) => left - right,
            '*': (left, right) => left * right,
            '/': (left, right) => left / right,
            '**': (left, right) => Math.pow(left, right),
        };

        const [operator] = input.match(/\*\*|[+\-*/]/) || [];
        if (!operator) return failure();

        const operation = ops[operator];
        if (!operation) return failure();

        return success(operation, input.slice(operator.length));
    });

    it('should handle single operand', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('2');

        assertResult<number>(result, [2, '']);
    });

    it('should parse right-associative operations', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('2**3**2');

        assertResult<number>(result, [512, '']); // 2**(3**2) = 2**9 = 512
    });

    it('should demonstrate right associativity vs left', () => {
        {
            const rightParser = rightAssoc(numberParser, operatorParser);
            const result = rightParser('10-3-2');

            assertResult<number>(result, [9, '']); // 10-(3-2) = 9
        }
        {
            const leftParser = leftAssoc(numberParser, operatorParser);
            const result = leftParser('10-3-2');

            assertResult<number>(result, [5, '']); // (10-3)-2 = 5
        }
    });

    it('should stop when operator is not found', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('2**3^4');

        assertResult<number>(result, [8, '^4']); // 2**3, then stops
    });

    it('should handle complex right-associative chains', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('2**2**3');

        assertResult<number>(result, [256, '']); // 2**(2**3) = 2**8 = 256
    });

    it('should fail when first operand fails', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('abc');

        assertResult<number>(result);
    });

    it('should handle incomplete operations', () => {
        const parser = rightAssoc(numberParser, operatorParser);
        const result = parser('2**');

        assertResult<number>(result, [2, '**']); // Stops at incomplete operation
    });
});
