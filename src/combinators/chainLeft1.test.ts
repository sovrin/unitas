import { describe, it } from 'vitest';

import { operation, digits } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { chainLeft1 } from './chainLeft1';

describe('chainLeft1', () => {
    it('should parse left-associative sums without other combinators', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('1+1+1');

        assertSuccess<number>(result, 3, ''); // ((1+1)+1)
    });

    it('should handle single operand', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('42');

        assertSuccess<number>(result, 42, '');
    });

    it('should parse left-associative operations', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('1+2+3');

        assertSuccess<number>(result, 6, ''); // ((1+2)+3)
    });

    it('should handle mixed operations with same precedence', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('10-3+2');

        assertSuccess<number>(result, 9, ''); // ((10-3)+2)
    });

    it('should stop when operator is not found', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('1+2*3^4');

        assertSuccess<number>(result, 9, '^4'); //  1+2, then stops
    });

    it('should handle multiplication and division', () => {
        const parser = chainLeft1(digits, operation);
        {
            const result = parser('8/2*3');

            assertSuccess<number>(result, 12, ''); // ((8/2)*3)
        }
        {
            const result = parser('24/3/2');

            assertSuccess<number>(result, 4, ''); // ((24/3)/2)
        }
    });

    it('should fail when first operand fails', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('abc');

        assertFailure<number>(result);
    });

    it('should handle trailing operators gracefully', () => {
        const parser = chainLeft1(digits, operation);
        const result = parser('1+2+');

        assertSuccess<number>(result, 3, '+'); // Stops at incomplete operation
    });
});
