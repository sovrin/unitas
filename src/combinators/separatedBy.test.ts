import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { separatedBy } from './separatedBy';

describe('separatedBy', () => {
    it('should parse zero elements when first parser fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('C');

        assertResult<'A'[]>(result, [[], 'C']);
    });

    it('should parse single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('AAACCC');

        assertResult<'A'[]>(result, [['A'], 'AACCC']);
    });

    it('should parse multiple elements separated by separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,A');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should handle trailing separator by not consuming it', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,A,');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], ',']);
    });

    it('should handle separator without following element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy(parser1, parser2);
        const result = parser('A,A,C');

        assertResult<'A'[]>(result, [['A', 'A'], ',C']);
    });
});
