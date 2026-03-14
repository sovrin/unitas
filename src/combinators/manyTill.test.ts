import { describe, expect, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { manyTill } from './manyTill';

describe('manyTill', () => {
    it('should parse until terminator matches', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AAAB');

        assertResult<string[]>(result, [['A', 'A', 'A'], '']);
    });

    it('should return empty array if terminator matches immediately', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('B');

        assertResult<string[]>(result, [[], '']);
    });

    it('should fail if terminator never matches', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AAA');

        expect(result).toBeNull();
    });

    it('should stop at first terminator match', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AABAB');

        assertResult<string[]>(result, [['A', 'A'], 'AB']);
    });
});
