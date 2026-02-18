import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { endBy1 } from './endBy1';

describe('endBy1', () => {
    it('should require at least one element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy1(parser1, parser2);
        const result = parser('CCC');

        assertResult<'A'[]>(result);
    });

    it('should parse single element with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy1(parser1, parser2);
        const result = parser('A,');

        assertResult<'A'[]>(result, [['A'], '']);
    });

    it('should parse multiple elements each with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy1(parser1, parser2);
        const result = parser('A,A,A,');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should not match when element lacks terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy1(parser1, parser2);
        const result = parser('A,A,A');

        assertResult<'A'[]>(result, [['A', 'A'], 'A']);
    });

    it('should fail on empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser = endBy1(parser1, parser2);
        const result = parser('');

        assertResult<'A'[]>(result);
    });
});
