import { describe, expect, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { regex } from './regex';

describe('regex', () => {
    it('should match pattern at beginning of input', () => {
        const parser = regex(/\d+/);
        const result = parser('123abc');

        assertSuccess<string>(result, '123', 3);
    });

    it('should fail when pattern does not match at beginning', () => {
        const parser = regex(/\d+/);
        const result = parser('abc123');

        assertFailure<string>(result);
    });

    it('should work with anchored patterns', () => {
        const parser = regex(/^[a-z]+/);
        const result = parser('hello123');

        assertSuccess<string>(result, 'hello', 5);
    });

    it('should keep a leading caret as a line anchor when multiline', () => {
        const parser = regex(/^# /m);

        assertSuccess<string>(parser('# hi'), '# ', 2);
        assertSuccess<string>(parser('a\n# hi', 2), '# ', 4);
        assertFailure<string>(parser('a# hi', 1), 1);
    });

    it('should handle empty matches', () => {
        const parser = regex(/\d*/);
        const result = parser('abc');

        assertSuccess<string>(result, '', 0);
    });

    it('should throw error if a regex with global flag is being used', () => {
        expect(() => {
            regex(/\d*/g);
        }).toThrowError('Global flag is not supported in regex parsers');
    });
});
