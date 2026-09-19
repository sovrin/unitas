import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { manyAtLeast } from './manyAtLeast';

describe('manyAtLeast', () => {
    const parser1 = createTestParser('A');

    it('should parse at least n occurrences', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 3);
    });

    it('should parse exactly n occurrences', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AABCD');

        assertSuccess<'A'[]>(result, ['A', 'A'], 2);
    });

    it('should fail if fewer than n occurrences', () => {
        const parser = manyAtLeast(parser1, 3);
        const result = parser('AABCD');

        assertFailure<'A'[]>(result);
    });

    it('should handle minimum of zero', () => {
        const parser = manyAtLeast(parser1, 0);
        const result = parser('BCD');

        assertSuccess<'A'[]>(result, [], 0);
    });

    it('should parse many more than minimum', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AAAAAA');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A', 'A', 'A', 'A'], 6);
    });
});
