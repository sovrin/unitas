import { describe, expect, it } from 'vitest';
import { literal } from './literal';
import { parenthesized } from './parenthesized';
import { assertResult } from '../../test/utils.test';

describe('parenthesized', () => {
    it('should parse parenthesized content', () => {
        const parser1 = literal('ABC');
        const parser = parenthesized(parser1);
        const result = parser('(ABC)');

        assertResult<'ABC'>(result, ['ABC', '']);
    });

    it('should fail with uneven parentheses', () => {
        const parser1 = literal('ABC');
        const parser = parenthesized(parser1);
        const result = parser('(ABC');

        assertResult<'ABC'>(result);
    });

    it('should handle empty parentheses', () => {
        const parser1 = literal('');
        const parser = parenthesized(parser1);
        const result = parser('()');
        expect(result).toEqual(['', '']);

        assertResult<''>(result, ['', '']);
    });
});
