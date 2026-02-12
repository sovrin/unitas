import { describe, it } from 'vitest';
import { chainRight1 } from './chainRight1';
import { chainLeft1 } from './chainLeft1';
import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';

describe('chainRight1', () => {
    it('should handle single operand', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('2');

        assertResult<number>(result, [2, '']);
    });

    it('should parse right-associative operations', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('2**3**2');

        assertResult<number>(result, [512, '']); // 2**(3**2) = 2**9 = 512
    });

    it('should demonstrate right associativity vs left', () => {
        {
            const rightParser = chainRight1(numberParser, operatorParser);
            const result = rightParser('10-3-2');

            assertResult<number>(result, [9, '']); // 10-(3-2) = 9
        }
        {
            const leftParser = chainLeft1(numberParser, operatorParser);
            const result = leftParser('10-3-2');

            assertResult<number>(result, [5, '']); // (10-3)-2 = 5
        }
    });

    it('should stop when operator is not found', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('2**3^4');

        assertResult<number>(result, [8, '^4']); // 2**3, then stops
    });

    it('should handle complex right-associative chains', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('2**2**3');

        assertResult<number>(result, [256, '']); // 2**(2**3) = 2**8 = 256
    });

    it('should fail when first operand fails', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('abc');

        assertResult<number>(result);
    });

    it('should handle incomplete operations', () => {
        const parser = chainRight1(numberParser, operatorParser);
        const result = parser('2**');

        assertResult<number>(result, [2, '**']); // Stops at incomplete operation
    });
});
