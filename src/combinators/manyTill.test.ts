import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { manyTill } from './manyTill';

describe('manyTill', () => {
    it('should parse until terminator matches', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AAAB');

        assertSuccess<string[]>(result, ['A', 'A', 'A'], 4);
    });

    it('should return empty array if terminator matches immediately', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('B');

        assertSuccess<string[]>(result, [], 1);
    });

    it('should fail if terminator never matches', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AAA');

        assertFailure(result);
    });

    it('should stop at first terminator match', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = manyTill(parser1, parser2);
        const result = parser('AABAB');

        assertSuccess<string[]>(result, ['A', 'A'], 3);
    });
});
