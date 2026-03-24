import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { lowercase, type LowercaseLetter } from './lowercase';

describe('lowercase', () => {
    it('should parse lowercase letter', () => {
        const result = lowercase('abc');

        assertSuccess<LowercaseLetter>(result, 'a', 'bc');
    });

    it('should fail on uppercase', () => {
        const result = lowercase('ABC');

        assertFailure<LowercaseLetter>(result);
    });

    it('should fail on empty input', () => {
        const result = lowercase('');

        assertFailure<LowercaseLetter>(result);
    });

    it('should narrow result to first character type for const string', () => {
        const result = lowercase('abc' as const);

        assertSuccess<'a'>(result, 'a', 'bc');
    });
});
