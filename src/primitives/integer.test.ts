import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { integer } from './integer';

describe('integer', () => {
    it('should parse a positive integer', () => {
        assertSuccess<number>(integer('42'), 42, '');
    });

    it('should parse a negative integer', () => {
        assertSuccess<number>(integer('-7'), -7, '');
    });

    it('should parse multi-digit negative integer', () => {
        assertSuccess<number>(integer('-123'), -123, '');
    });

    it('should stop at non-numeric character', () => {
        assertSuccess<number>(integer('123abc'), 123, 'abc');
    });

    it('should fail on non-numeric input', () => {
        assertFailure<number>(integer('abc'));
    });

    it('should fail on empty input', () => {
        assertFailure<number>(integer(''));
    });
});
