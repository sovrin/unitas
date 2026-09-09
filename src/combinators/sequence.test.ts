import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { sequence } from './sequence';

describe('sequence', () => {
    it('should call parsers in order and collect results', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser3 = createTestParser('C');
        const parser = sequence(parser1, parser2, parser3);
        const result = parser('ABCDE');

        assertSuccess<['A', 'B', 'C'] | null>(result, ['A', 'B', 'C'], 3);
    });

    it('should thread remaining input through parsers', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = sequence(parser1, parser2);
        const result = parser('ABC');

        assertSuccess<['A', 'B'] | null>(result, ['A', 'B'], 2);
    });

    it('should fail if first parser fails', () => {
        const failureParser = create((_input, index = 0) =>
            failure(undefined, index),
        );
        const parser2 = createTestParser('B');
        const parser = sequence(failureParser, parser2);
        const result = parser('xxx');

        assertFailure<[unknown, 'B']>(result);
    });

    it('should fail if middle parser fails', () => {
        const parser1 = createTestParser('A');
        const failureParser = create((_input, index = 0) =>
            failure(undefined, index),
        );
        const parser3 = createTestParser('C');
        const parser = sequence(parser1, failureParser, parser3);
        const result = parser('xxx');

        assertFailure<['A', unknown, 'C']>(result);
    });

    it('should handle empty sequence', () => {
        const parser = sequence();
        const result = parser('anything');

        assertSuccess<[] | null>(result, [], 0);
    });

    it('should preserve parser result types', () => {
        const strParser = create<'text'>((input) =>
            success('text', input.length),
        );
        const numParser = create<42>((input) => success(42, input.length));
        const parser = sequence(strParser, numParser);
        const result = parser('xx');

        assertSuccess<[string, number]>(result, ['text', 42], 2);
    });
});
