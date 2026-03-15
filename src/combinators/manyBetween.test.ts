import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { manyBetween } from './manyBetween';

describe('manyBetween', () => {
    const parser1 = createTestParser('A');

    it('should parse within range', () => {
        const parser = manyBetween(parser1, 2, 4);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'BCD');
    });

    it('should parse minimum required', () => {
        const parser = manyBetween(parser1, 2, 4);
        const result = parser('AABCD');

        assertSuccess<'A'[]>(result, ['A', 'A'], 'BCD');
    });

    it('should parse maximum allowed', () => {
        const parser = manyBetween(parser1, 2, 4);
        const result = parser('AAAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A', 'A'], 'BCD');
    });

    it('should not parse more than maximum', () => {
        const parser = manyBetween(parser1, 1, 3);
        const result = parser('AAAAAA');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'AAA');
    });

    it('should fail if fewer than minimum', () => {
        const parser = manyBetween(parser1, 3, 5);
        const result = parser('AABCD');

        assertFailure<'A'[]>(result);
    });

    it('should handle equal min and max', () => {
        const parser = manyBetween(parser1, 3, 3);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'BCD');
    });
});
