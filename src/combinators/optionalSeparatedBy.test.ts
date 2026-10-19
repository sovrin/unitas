import { describe, it } from 'vitest';

import { nothing } from '../../test/helpers';
import { assertSuccess, createTestParser } from '../../test/utils';
import { optionalSeparatedBy } from './optionalSeparatedBy';

describe('optionalSeparatedBy', () => {
    it('should parse no elements when first parser fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('B');

        assertSuccess<(string | null)[]>(result, [], 0);
    });

    it('should parse single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('AAACCC');

        assertSuccess<(string | null)[]>(result, ['A'], 1);
    });

    it('should parse multiple elements separated by separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('A,A,A');

        assertSuccess<(string | null)[]>(result, ['A', 'A', 'A'], 5);
    });

    it('should handle leading separator as null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser(',A');

        assertSuccess<(string | null)[]>(result, [null, 'A'], 2);
    });

    it('should handle trailing separator without adding null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('A,');

        assertSuccess<(string | null)[]>(result, ['A'], 2);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser('');

        assertSuccess<(string | null)[]>(result, [], 0);
    });

    it('should handle single separator only as leading null', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = optionalSeparatedBy(parser1, parser2);
        const result = parser(',');

        assertSuccess<(string | null)[]>(result, [null], 1);
    });

    it('should keep empty slots between separators as null', () => {
        const parser = optionalSeparatedBy(
            createTestParser(1),
            createTestParser(','),
        );

        assertSuccess<(number | null)[]>(parser('1,,1'), [1, null, 1], 4);
        assertSuccess<(number | null)[]>(parser(',,1'), [null, null, 1], 3);
    });

    it('should stop when neither item nor separator consumes input', () => {
        const parser = optionalSeparatedBy(nothing, nothing);

        assertSuccess<null[]>(parser('abc'), [null], 0);
    });
});
