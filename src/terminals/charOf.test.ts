import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { charOf } from './charOf';

describe('charOf', () => {
    it('should match character from allowed set', () => {
        const parser = charOf(['A', 'B', 'C'] as const);
        const result = parser('ABCDEFG');

        assertResult<'A' | 'B' | 'C'>(result, ['A', 'BCDEFG']);
    });

    it('should fail when character is not in set', () => {
        const parser = charOf(['A', 'B', 'C'] as const);
        const result = parser('DEFG');

        assertResult<'A' | 'B' | 'C'>(result);
    });

    it('should handle empty character set', () => {
        const parser = charOf([] as const);
        const result = parser('abc');

        assertResult<never>(result);
    });

    it('should handle empty input', () => {
        const parser = charOf(['A'] as const);
        const result = parser('');

        assertResult<'A'>(result);
    });
});
