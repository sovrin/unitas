import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { uppercase, type UppercaseLetter } from './uppercase';

describe('uppercase', () => {
    it('should parse uppercase letter', () => {
        const result = uppercase('ABC');

        assertSuccess<UppercaseLetter>(result, 'A', 'BC');
    });

    it('should fail on lowercase', () => {
        const result = uppercase('abc');

        assertFailure<UppercaseLetter>(result);
    });

    it('should fail on empty input', () => {
        const result = uppercase('');

        assertFailure<UppercaseLetter>(result);
    });

    it('should narrow result to first character type for const string', () => {
        const result = uppercase('ABC' as const);

        assertSuccess<'A'>(result, 'A', 'BC');
    });
});
