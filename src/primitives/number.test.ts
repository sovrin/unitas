import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { number } from './number';

describe('number', () => {
    it('should parse integer', () => {
        const result = number('42');

        assertSuccess<number>(result, 42, '');
    });

    it('should parse float', () => {
        const result = number('3.14');

        assertSuccess<number>(result, 3.14, '');
    });

    it('should parse negative integer', () => {
        const result = number('-7');

        assertSuccess<number>(result, -7, '');
    });

    it('should parse negative float', () => {
        const result = number('-2.5');

        assertSuccess<number>(result, -2.5, '');
    });

    it('should stop at non-numeric', () => {
        const result = number('42abc');

        assertSuccess<number>(result, 42, 'abc');
    });

    it('should fail on non-numeric input', () => {
        const result = number('abc');

        assertFailure<number>(result);
    });
});
