import { describe, it } from 'vitest';

import { operation, digits } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { chainLeft } from './chainLeft';

describe('chainLeft', () => {
    it('should return null when parser fails', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('abc');

        assertFailure(result);
    });

    it('should parse successful chain', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('1+2+3');

        assertSuccess<number | null>(result, 6, '');
    });

    it('should return single value when successful', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('42');

        assertSuccess<number | null>(result, 42, '');
    });

    it('should handle empty input', () => {
        const parser = chainLeft(digits, operation);
        const result = parser('');

        assertFailure(result);
    });
});
