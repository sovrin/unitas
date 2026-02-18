import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { separatedEndBy } from './separatedEndBy';

describe('separatedEndBy', () => {
    it('should parse empty list', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('CCC');

        assertResult<'A'[]>(result, [[], 'CCC']);
    });

    it('should parse elements without trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,A,A');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should parse elements with trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should handle single element with separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,');

        assertResult<'A'[]>(result, [['A'], '']);
    });

    it('should handle single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A');

        assertResult<'A'[]>(result, [['A'], '']);
    });
});
