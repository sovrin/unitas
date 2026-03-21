import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { charOf } from './charOf';

describe('charOf', () => {
    it('should match character from allowed set', () => {
        const parser = charOf(['A', 'B', 'C'] as const);
        const result = parser('ABCDEFG');

        assertSuccess<'A' | 'B' | 'C'>(result, 'A', 'BCDEFG');
    });

    it('should fail when character is not in set', () => {
        const parser = charOf(['A', 'B', 'C'] as const);
        const result = parser('DEFG');

        assertFailure<'A' | 'B' | 'C'>(result);
    });

    it('should handle empty character set', () => {
        const parser = charOf([] as const);
        const result = parser('abc');

        assertFailure<never>(result);
    });

    it('should handle empty input', () => {
        const parser = charOf(['A'] as const);
        const result = parser('');

        assertFailure<'A'>(result);
    });
});
