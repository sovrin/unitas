import { describe, it } from 'vitest';

import { assertSuccess, assertFailure } from '../../test/utils';
import { float } from './float';

describe('float', () => {
    it('should parse a positive float', () => {
        const result = float('1.23');

        assertSuccess(result, 1.23, '');
    });

    it('should parse a negative float', () => {
        const result = float('-2.5');

        assertSuccess(result, -2.5, '');
    });

    it('should parse float with many decimal places', () => {
        const result = float('123.456789');

        assertSuccess(result, 123.456789, '');
    });

    it('should fail on integer input', () => {
        const result = float('123');

        assertFailure(result);
    });

    it('should fail on non-numeric input', () => {
        const result = float('abc');

        assertFailure(result);
    });

    it('should fail on decimal without leading digit', () => {
        const result = float('.5');

        assertFailure(result);
    });

    it('should stop at non-numeric character', () => {
        const result = float('1.23abc');

        assertSuccess(result, 1.23, 'abc');
    });
});
