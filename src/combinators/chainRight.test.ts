import { describe, it } from 'vitest';

import { digits, operation } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { chainRight } from './chainRight';

describe('chainRight', () => {
    it('should return null when parser fails', () => {
        const parser = chainRight(digits, operation);
        const result = parser('abc');

        assertFailure(result);
    });

    it('should parse successful chain', () => {
        const parser = chainRight(digits, operation);
        const result = parser('2**3');

        assertSuccess<number | null>(result, 8, '');
    });

    it('should return single value when successful', () => {
        const parser = chainRight(digits, operation);
        const result = parser('5');

        assertSuccess<number | null>(result, 5, '');
    });

    it('should handle empty input', () => {
        const parser = chainRight(digits, operation);
        const result = parser('');

        assertFailure(result);
    });

    it('should demonstrate right associativity', () => {
        const parser = chainRight(digits, operation);
        const result = parser('10-3-2');

        assertSuccess<number | null>(result, 9, ''); // 10-(3-2)
    });
});
