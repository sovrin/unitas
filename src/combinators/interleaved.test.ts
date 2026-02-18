import { describe, expect, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { interleaved } from './interleaved';

describe('interleaved', () => {
    it('should parse alternating items and separators', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('ABABA');

        assertResult<('A' | 'B')[]>(result, [['A', 'B', 'A', 'B', 'A'], '']);
    });

    it('should handle single item', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('AC');
        expect(result).toEqual([['A'], 'C']);

        assertResult<('A' | 'B')[]>(result, [['A'], 'C']);
    });

    it('should handle no match', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('CC');

        assertResult<('A' | 'B')[]>(result, [[], 'CC']);
    });

    it('should stop when separator has no following item', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('ABABC');

        assertResult<('A' | 'B')[]>(result, [['A', 'B', 'A'], 'BC']);
    });
});
