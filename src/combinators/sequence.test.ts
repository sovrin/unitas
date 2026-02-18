import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { sequence } from './sequence';

describe('sequence', () => {
    it('should call parsers in order and collect results', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser3 = createTestParser('C');
        const parser = sequence(parser1, parser2, parser3);
        const result = parser('ABCDE');

        assertResult<['A', 'B', 'C'] | null>(result, [['A', 'B', 'C'], 'DE']);
    });

    it('should thread remaining input through parsers', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = sequence(parser1, parser2);
        const result = parser('ABC');

        assertResult<['A', 'B'] | null>(result, [['A', 'B'], 'C']);
    });

    it('should fail if first parser fails', () => {
        const parser1 = create(() => failure());
        const parser2 = createTestParser('B');
        const parser = sequence(parser1, parser2);
        const result = parser('xxx');

        assertResult<[unknown, 'B']>(result);
    });

    it('should fail if middle parser fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = create(() => failure());
        const parser3 = createTestParser('C');
        const parser = sequence(parser1, parser2, parser3);
        const result = parser('xxx');

        assertResult<['A', unknown, 'C']>(result);
    });

    it('should handle empty sequence', () => {
        const parser = sequence();
        const result = parser('anything');

        assertResult<[] | null>(result, [[], 'anything']);
    });

    it('should preserve parser result types', () => {
        const strParser = create<'text'>(() => success('text', ''));
        const numParser = create<42>(() => success(42, ''));
        const parser = sequence(strParser, numParser);
        const result = parser('xx');

        assertResult<[string, number]>(result, [['text', 42], '']);
    });
});
