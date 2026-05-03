import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { integer } from './integer';

describe('integer', () => {
    it('should parse a positive integer', () => {
        const result = integer('42');

        assertSuccess<number>(result, 42, '');
    });

    it('should parse a negative integer', () => {
        const result = integer('-7');

        assertSuccess<number>(result, -7, '');
    });

    it('should parse multi-digit negative integer', () => {
        const result = integer('-123');

        assertSuccess<number>(result, -123, '');
    });

    it('should stop at non-numeric character', () => {
        const result = integer('123abc');

        assertSuccess<number>(result, 123, 'abc');
    });

    it('should fail on non-numeric input', () => {
        const result = integer('abc');
        assertFailure<number>(result);
    });

    it('should fail on empty input', () => {
        const result = integer('');
        assertFailure<number>(result);
    });
});
