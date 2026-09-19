import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { endBy } from './endBy';

describe('endBy', () => {
    it('should parse elements each followed by terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 6);
    });

    it('should parse empty list when no elements', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('CCC');

        assertSuccess<'A'[]>(result, [], 0);
    });

    it('should require terminator after each element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('A,A,A');

        assertSuccess<'A'[]>(result, ['A', 'A'], 4);
    });

    it('should handle single element with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = endBy(parser1, parser2);
        const result = parser('A,');

        assertSuccess<'A'[]>(result, ['A'], 2);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('');

        assertSuccess<'A'[]>(result, [], 0);
    });
});
