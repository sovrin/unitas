import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { separatedEndBy1 } from './separatedEndBy1';

describe('separatedEndBy1', () => {
    it('should require at least one element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('CCC');

        assertResult<'A'[]>(result);
    });

    it('should parse single element without separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('ACC');

        assertResult<'A'[]>(result, [['A'], 'CC']);
    });

    it('should parse single element with separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('A,');

        assertResult<'A'[]>(result, [['A'], '']);
    });

    it('should parse multiple elements with trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('A,A,A,');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should parse multiple elements without trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('A,A,A');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should fail on empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedEndBy1(parser1, parser2);
        const result = parser('');

        assertResult<'A'[]>(result);
    });
});
