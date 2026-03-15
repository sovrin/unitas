import { describe, expect, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { success } from '../core/success';
import { many1 } from './many1';

describe('many1', () => {
    const parser1 = createTestParser('A');

    it('should fail on zero occurrences', () => {
        const parser = many1(parser1);
        const result = parser('BCD');

        assertFailure<'A'[]>(result);
    });

    it('should parse one occurrence', () => {
        const parser = many1(parser1);
        const result = parser('ABCD');

        assertSuccess<'A'[]>(result, ['A'], 'BCD');
    });

    it('should parse multiple occurrences', () => {
        const parser = many1(parser1);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'BCD');
    });

    it('should fail on empty input', () => {
        const parser = many1(parser1);
        const result = parser('');

        assertFailure<'A'[]>(result);
    });

    it('should fail when many returns null after first success', () => {
        let callCount = 0;
        const flakyParser = (input: string) => {
            callCount++;
            if (callCount === 1) {
                return success('A', input.slice(1));
            }

            // On subsequent calls, throw to make many() fail
            throw new Error('unexpected');
        };

        const parser = many1(flakyParser as any);

        // many() will throw internally, but this depends on many's implementation
        expect(() => parser('AAA')).toThrow();
    });
});
