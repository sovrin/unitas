import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { charIn } from './charIn';

describe('charIn', () => {
    it('should match character from allowed set', () => {
        const parser = charIn(['A', 'B', 'C'] as const);
        const result = parser('ABCDEFG');

        assertResult<'A' | 'B' | 'C'>(result, ['A', 'BCDEFG']);
    });

    it('should fail when character is not in set', () => {
        const parser = charIn(['A', 'B', 'C'] as const);
        const result = parser('DEFG');

        assertResult<'A' | 'B' | 'C'>(result);
    });

    it('should handle empty character set', () => {
        const parser = charIn([] as const);
        const result = parser('abc');

        assertResult<never>(result);
    });
});
