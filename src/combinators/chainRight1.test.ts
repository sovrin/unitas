import { describe, it } from 'vitest';

import { operation, digits } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { chainRight1 } from './chainRight1';

describe('chainRight1', () => {
    it('should handle single operand', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2');

        assertSuccess<number>(result, 2, '');
    });

    it('should parse right-associative operations', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**3**2');

        assertSuccess<number>(result, 512, ''); // 2**(3**2) = 2**9 = 512
    });

    it('should be right-associative', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('10-3-2');

        assertSuccess<number>(result, 9, ''); // 10-(3-2) = 9
    });

    it('should stop when operator is not found', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**3^4');

        assertSuccess<number>(result, 8, '^4'); // 2**3, then stops
    });

    it('should handle complex right-associative chains', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**2**3');

        assertSuccess<number>(result, 256, ''); // 2**(2**3) = 2**8 = 256
    });

    it('should fail when first operand fails', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('abc');

        assertFailure<number>(result);
    });

    it('should handle incomplete operations', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**');

        assertSuccess<number>(result, 2, '**'); // Stops at incomplete operation
    });
});
