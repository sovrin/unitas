import { describe, expect, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { regex } from './regex';

describe('regex', () => {
    it('should match pattern at beginning of input', () => {
        const parser = regex(/\d+/);
        const result = parser('123abc');

        assertSuccess<string>(result, '123', 'abc');
    });

    it('should fail when pattern does not match at beginning', () => {
        const parser = regex(/\d+/);
        const result = parser('abc123');

        assertFailure<string>(result);
    });

    it('should work with anchored patterns', () => {
        const parser = regex(/^[a-z]+/);
        const result = parser('hello123');

        assertSuccess<string>(result, 'hello', '123');
    });

    it('should handle empty matches', () => {
        const parser = regex(/\d*/);
        const result = parser('abc');

        assertSuccess<string>(result, '', 'abc');
    });

    it('should throw error if a regex with global flag is being used', () => {
        expect(() => {
            regex(/\d*/g);
        }).toThrowError('Global flag is not supported in regex parsers');
    });
});
