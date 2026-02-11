import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { exactly } from './exactly';

describe('exactly', () => {
    const parser1 = createTestParser('A');

    it('should parse exactly n occurrences', () => {
        const parser = exactly(parser1, 3);
        const result = parser('AAABCD');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], 'BCD']);
    });

    it('should fail if fewer than n occurrences', () => {
        const parser = exactly(parser1, 3);
        const result = parser('AABCD');

        assertResult<'A'[]>(result, null);
    });

    it('should parse exactly n and leave remainder', () => {
        const parser = exactly(parser1, 2);
        const result = parser('AAAAA');

        assertResult<'A'[]>(result, [['A', 'A'], 'AAA']);
    });

    it('should handle count of zero', () => {
        const parser = exactly(parser1, 0);
        const result = parser('AAABCD');

        assertResult<'A'[]>(result, [[], 'AAABCD']);
    });

    it('should fail on empty input when count > 0', () => {
        const parser = exactly(parser1, 2);
        const result = parser('');

        assertResult<'A'[]>(result);
    });
});
