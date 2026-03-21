import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { literal } from '../terminals/literal';
import { parenthesized } from './parenthesized';

describe('parenthesized', () => {
    it('should parse parenthesized content', () => {
        const parser1 = literal('ABC');
        const parser = parenthesized(parser1);
        const result = parser('(ABC)');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven parentheses', () => {
        const parser1 = literal('ABC');
        const parser = parenthesized(parser1);
        const result = parser('(ABC');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty parentheses', () => {
        const parser1 = literal('');
        const parser = parenthesized(parser1);
        const result = parser('()');

        assertSuccess<''>(result, '', '');
    });
});
