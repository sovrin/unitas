import { describe, expect, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { many1 } from './many1';

describe('many1', () => {
    const parser1 = createTestParser('A');

    it('should fail on zero occurrences', () => {
        const parser = many1(parser1);
        const result = parser('BCD');

        assertResult<'A'[]>(result);
    });

    it('should parse one occurrence', () => {
        const parser = many1(parser1);
        const result = parser('ABCD');

        assertResult<'A'[]>(result, [['A'], 'BCD']);
    });

    it('should parse multiple occurrences', () => {
        const parser = many1(parser1);
        const result = parser('AAABCD');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], 'BCD']);
    });

    it('should fail on empty input', () => {
        const parser = many1(parser1);
        const result = parser('');
        expect(result).toBeNull();

        assertResult<'A'[]>(result);
    });
});
