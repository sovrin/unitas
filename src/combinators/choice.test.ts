import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { choice } from './choice';

describe('choice', () => {
    it('should try parsers in order and return first success', () => {
        const parserA = create<'A'>((_input, index = 0) => failure(index));
        const parserB = create<'B'>((input, index = 0) => success('B', index + 1));
        const parserC = create<'C'>((input, index = 0) => success('C', index + 1));
        const parser = choice(parserA, parserB, parserC);
        const result = parser('ABC');

        assertSuccess<'A' | 'B' | 'C'>(result, 'B', 1);
    });

    it('should try all parsers if earlier ones fail', () => {
        const parserA = create<'A'>((_input, index = 0) => failure(index));
        const parserB = create<'B'>((_input, index = 0) => failure(index));
        const parserC = create<'C'>((input, index = 0) => success('C', index + 1));
        const parser = choice(parserA, parserB, parserC);
        const result = parser('C D');

        assertSuccess<'A' | 'B' | 'C'>(result, 'C', 1);
    });

    it('should fail if all parsers fail', () => {
        const parser = choice(
            (_input, index = 0) => failure(index),
            (_input, index = 0) => failure(index),
            (_input, index = 0) => failure(index),
        );
        const result = parser('D');

        assertFailure<unknown>(result);
    });

    it('should handle different types', () => {
        const parserA = create<'A'>((input, index = 0) => success('A', index + 1));
        const parserB = create<'B'[]>((input, index = 0) =>
            success(['B'], index + 1),
        );
        const parser = choice(parserA, parserB);
        const result = parser('ABC');

        assertSuccess<'A' | 'B'[]>(result, 'A', 1);
    });

    it('should handle single parser', () => {
        const parser1 = createTestParser('A');
        const parser = choice(parser1);
        const result = parser('ABCD');

        assertSuccess<'A'>(result, 'A', 1);
    });

    it('should handle empty choices', () => {
        const parser = choice();
        const result = parser('anything');

        assertFailure<unknown>(result);
    });
});
