import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { separatedBy } from './separatedBy';

describe('separatedBy', () => {
    it('should parse zero elements when first parser fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('C');

        assertSuccess<'A'[]>(result, [], 0);
    });

    it('should parse single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('AAACCC');

        assertSuccess<'A'[]>(result, ['A'], 1);
    });

    it('should parse multiple elements separated by separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,A');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 5);
    });

    it('should handle trailing separator by not consuming it', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 5);
    });

    it('should handle separator without following element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,C');

        assertSuccess<'A'[]>(result, ['A', 'A'], 3);
    });
});
