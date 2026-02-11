import { describe, expect, it } from 'vitest';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { many } from './many';
import { assertResult, createTestParser } from '../../test/utils.test';

describe('many', () => {
    it('should parse zero occurrences', () => {
        const parser1 = create(() => failure());
        const parser = many(parser1);
        const result = parser('BCD');

        assertResult<unknown[]>(result, [[], 'BCD']);
    });

    it('should parse one occurrence', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('ABCD');

        assertResult<'A'[]>(result, [['A'], 'BCD']);
    });

    it('should parse multiple occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('AAABCD');

        assertResult<'A'[]>(result, [['A', 'A', 'A'], 'BCD']);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('');

        assertResult<'A'[]>(result, [[], '']);
    });

    it('should prevent infinite loops with non-consuming parsers', () => {
        const nonConsumingParser = () => ['', 'AB'] as [string, string];
        const parser = many(nonConsumingParser);
        const result = parser('AB');
        expect(result).toEqual([[], 'AB']);

        assertResult<string[]>(result, [[], 'AB']);
    });
});
