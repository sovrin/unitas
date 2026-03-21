import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { manyAtMost } from './manyAtMost';

describe('manyAtMost', () => {
    const parser1 = createTestParser('A');

    it('should parse up to n occurrences', () => {
        const parser = manyAtMost(parser1, 3);
        const result = parser('AABCD');

        assertSuccess<'A'[]>(result, ['A', 'A'], 'BCD');
    });

    it('should parse exactly n occurrences when available', () => {
        const parser = manyAtMost(parser1, 3);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'BCD');
    });

    it('should not parse more than n occurrences', () => {
        const parser = manyAtMost(parser1, 2);
        const result = parser('AAAAAA');

        assertSuccess<'A'[]>(result, ['A', 'A'], 'AAAA');
    });

    it('should parse zero occurrences', () => {
        const parser = manyAtMost(parser1, 3);
        const result = parser('BCD');

        assertSuccess<'A'[]>(result, [], 'BCD');
    });

    it('should handle limit of zero', () => {
        const parser = manyAtMost(parser1, 0);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, [], 'AAABCD');
    });
});
