import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { take } from './take';

describe('take', () => {
    it('should take specified number of characters', () => {
        const parser = take(3);
        const result = parser('abcdef');

        assertSuccess<string>(result, 'abc', 3);
    });

    it('should take all characters when count equals input length', () => {
        const parser = take(3);
        const result = parser('abc');

        assertSuccess<string>(result, 'abc', 3);
    });

    it('should fail when input is shorter than count', () => {
        const parser = take(5);
        const result = parser('abc');

        assertFailure<string>(result);
    });

    it('should handle zero count', () => {
        const parser = take(0);
        const result = parser('abc');

        assertSuccess<string>(result, '', 0);
    });

    it('should describe a single character in the singular', () => {
        const result = take(1)('');

        assertFailure(result, 0, ['1 more character']);
    });

    it('should describe several characters in the plural', () => {
        const result = take(3)('ab');

        assertFailure(result, 0, ['3 more characters']);
    });
});
