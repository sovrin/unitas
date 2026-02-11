import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { manyAtLeast } from './manyAtLeast';

describe('manyAtLeast', () => {
    const parser1 = createTestParser('A');

    it('should parse at least n occurrences', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AAABCD');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], 'BCD']);
    });

    it('should parse exactly n occurrences', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AABCD');

        assertResult<'A'[]>(result, [['A', 'A'], 'BCD']);
    });

    it('should fail if fewer than n occurrences', () => {
        const parser = manyAtLeast(parser1, 3);
        const result = parser('AABCD');

        assertResult<'A'[]>(result);
    });

    it('should handle minimum of zero', () => {
        const parser = manyAtLeast(parser1, 0);
        const result = parser('BCD');

        assertResult<'A'[]>(result, [[], 'BCD']);
    });

    it('should parse many more than minimum', () => {
        const parser = manyAtLeast(parser1, 2);
        const result = parser('AAAAAA');

        assertResult<'A'[]>(result, [['A', 'A', 'A', 'A', 'A', 'A'], '']);
    });
});
