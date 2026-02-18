import { describe, it } from 'vitest';

import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';
import { chainLeft1 } from './chainLeft1';

describe('chainLeft1', () => {
    it('should parse left-associative sums without other combinators', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('1+1+1');

        assertResult<number>(result, [3, '']); // ((1+1)+1)
    });

    it('should handle single operand', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('42');

        assertResult<number>(result, [42, '']);
    });

    it('should parse left-associative operations', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('1+2+3');

        assertResult<number>(result, [6, '']); // ((1+2)+3)
    });

    it('should handle mixed operations with same precedence', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('10-3+2');

        assertResult<number>(result, [9, '']); // ((10-3)+2)
    });

    it('should stop when operator is not found', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('1+2*3^4');

        assertResult<number>(result, [9, '^4']); //  1+2, then stops
    });

    it('should handle multiplication and division', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        {
            const result = parser('8/2*3');

            assertResult<number>(result, [12, '']); // ((8/2)*3)
        }
        {
            const result = parser('24/3/2');

            assertResult<number>(result, [4, '']); // ((24/3)/2)
        }
    });

    it('should fail when first operand fails', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('abc');

        assertResult<number>(result);
    });

    it('should handle trailing operators gracefully', () => {
        const parser = chainLeft1(numberParser, operatorParser);
        const result = parser('1+2+');

        assertResult<number>(result, [3, '+']); // Stops at incomplete operation
    });
});
