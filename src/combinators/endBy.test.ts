import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { endBy } from './endBy';

describe('endBy', () => {
    it('should parse elements each followed by terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should parse empty list when no elements', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('CCC');

        assertResult<'A'[]>(result, [[], 'CCC']);
    });

    it('should require terminator after each element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('A,A,A');

        assertResult<'A'[]>(result, [['A', 'A'], 'A']);
    });

    it('should handle single element with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = endBy(parser1, parser2);
        const result = parser('A,');

        assertResult<'A'[]>(result, [['A'], '']);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy(parser1, parser2);
        const result = parser('');

        assertResult<'A'[]>(result, [[], '']);
    });
});
