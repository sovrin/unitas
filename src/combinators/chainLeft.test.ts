import { describe, it } from 'vitest';

import { operation, digits } from '../../test/helpers';
import { assertSuccess } from '../../test/utils';
import { chainLeft } from './chainLeft';

describe('chainLeft', () => {
    it('should return null when parser fails', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('abc');

        assertSuccess<number | null>(result, null, 0);
    });

    it('should parse successful chain', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('1+2+3');

        assertSuccess<number | null>(result, 6, 5);
    });

    it('should return single value when successful', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('42');

        assertSuccess<number | null>(result, 42, 2);
    });

    it('should handle empty input', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('');

        assertSuccess<number | null>(result, null, 0);
    });
});
