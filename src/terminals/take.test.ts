import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { take } from './take';

describe('take', () => {
    it('should take specified number of characters', () => {
        const parser = take(3);
        const result = parser('abcdef');

        assertSuccess<string>(result, 'abc', 'def');
    });

    it('should take all characters when count equals input length', () => {
        const parser = take(3);
        const result = parser('abc');

        assertSuccess<string>(result, 'abc', '');
    });

    it('should fail when input is shorter than count', () => {
        const parser = take(5);
        const result = parser('abc');

        assertFailure<string>(result);
    });

    it('should handle zero count', () => {
        const parser = take(0);
        const result = parser('abc');

        assertSuccess<string>(result, '', 'abc');
    });
});
