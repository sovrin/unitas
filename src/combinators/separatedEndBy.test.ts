import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { separatedEndBy } from './separatedEndBy';

describe('separatedEndBy', () => {
    it('should parse empty list', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('CCC');

        assertSuccess<'A'[]>(result, [], 'CCC');
    });

    it('should parse elements without trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,A,A');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], '');
    });

    it('should parse elements with trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], '');
    });

    it('should handle single element with separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A,');

        assertSuccess<'A'[]>(result, ['A'], '');
    });

    it('should handle single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy(parser1, parser2);
        const result = parser('A');

        assertSuccess<'A'[]>(result, ['A'], '');
    });
});
