import { describe, it } from 'vitest';

import { operation, digits, nothing } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { create } from '../core/parser';
import { success } from '../core/success';
import { chainRight1 } from './chainRight1';

describe('chainRight1', () => {
    it('should handle single operand', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2');

        assertSuccess<number>(result, 2, 1);
    });

    it('should parse right-associative operations', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**3**2');

        assertSuccess<number>(result, 512, 7); // 2**(3**2) = 2**9 = 512
    });

    it('should be right-associative', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('10-3-2');

        assertSuccess<number>(result, 9, 6); // 10-(3-2) = 9
    });

    it('should stop when operator is not found', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**3^4');

        assertSuccess<number>(result, 8, 4); // 2**3, then stops
    });

    it('should handle complex right-associative chains', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**2**3');

        assertSuccess<number>(result, 256, 7); // 2**(2**3) = 2**8 = 256
    });

    it('should fail when first operand fails', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('abc');

        assertFailure<number>(result);
    });

    it('should handle incomplete operations', () => {
        const parser = chainRight1(digits, operation);
        const result = parser('2**');

        assertSuccess<number>(result, 2, 1); // Stops at incomplete operation
    });

    it('should stop when neither term nor operator consumes input', () => {
        const keep = create<(left: null, right: null) => null>(
            (_input, index = 0) => success((left) => left, index),
        );
        const parser = chainRight1(nothing, keep);

        assertSuccess<null>(parser('abc'), null, 0);
    });
});
