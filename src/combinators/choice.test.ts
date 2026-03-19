import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { choice } from './choice';

describe('choice', () => {
    it('should try parsers in order and return first success', () => {
        const parserA = create<'A'>(() => failure());
        const parserB = create<'B'>((input) => success('B', input.slice(1)));
        const parserC = create<'C'>((input) => success('C', input.slice(1)));
        const parser = choice(parserA, parserB, parserC);
        const result = parser('ABC');

        assertSuccess<'A' | 'B' | 'C'>(result, 'B', 'BC');
    });

    it('should try all parsers if earlier ones fail', () => {
        const parserA = create<'A'>(() => failure());
        const parserB = create<'B'>(() => failure());
        const parserC = create<'C'>((input) => success('C', input.slice(1)));
        const parser = choice(parserA, parserB, parserC);
        const result = parser('C D');

        assertSuccess<'A' | 'B' | 'C'>(result, 'C', ' D');
    });

    it('should fail if all parsers fail', () => {
        const parser = choice(
            () => failure(),
            () => failure(),
            () => failure(),
        );
        const result = parser('D');

        assertFailure<unknown>(result);
    });

    it('should handle different types', () => {
        const parserA = create<'A'>((input) => success('A', input.slice(1)));
        const parserB = create<'B'[]>((input) =>
            success(['B'], input.slice(1)),
        );
        const parser = choice(parserA, parserB);
        const result = parser('ABC');

        assertSuccess<'A' | 'B'[]>(result, 'A', 'BC');
    });

    it('should handle single parser', () => {
        const parser1 = createTestParser('A');
        const parser = choice(parser1);
        const result = parser('ABCD');

        assertSuccess<'A'>(result, 'A', 'BCD');
    });

    it('should handle empty choices', () => {
        const parser = choice();
        const result = parser('anything');

        assertFailure<unknown>(result);
    });
});
