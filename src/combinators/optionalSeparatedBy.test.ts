import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { optionalSeparatedBy } from './optionalSeparatedBy';

describe('optionalSeparatedBy', () => {
    it('should parse no elements when first parser fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('B');

        assertSuccess<(string | null)[]>(result, [], 'B');
    });

    it('should parse single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('AAACCC');

        assertSuccess<(string | null)[]>(result, ['A'], 'AACCC');
    });

    it('should parse multiple elements separated by separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('A,A,A');

        assertSuccess<(string | null)[]>(result, ['A', 'A', 'A'], '');
    });

    it('should handle leading separator as null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser(',A');

        assertSuccess<(string | null)[]>(result, [null, 'A'], '');
    });

    it('should handle trailing separator without adding null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('A,');

        assertSuccess<(string | null)[]>(result, ['A'], '');
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('');

        assertSuccess<(string | null)[]>(result, [], '');
    });

    it('should handle single separator only as leading null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser(',');

        assertSuccess<(string | null)[]>(result, [null], '');
    });
});
