import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { parenthesized } from './parenthesized';

describe('parenthesized', () => {
    it('should parse parenthesized content', () => {
        const parser = parenthesized(createTestParser('ABC'));
        const result = parser('(ABC)');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven parentheses', () => {
        const parser = parenthesized(createTestParser('ABC'));
        const result = parser('(ABC');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty parenthesis input', () => {
        const parser = parenthesized(createTestParser(''));
        const result = parser('()');

        assertSuccess<''>(result, '', '');
    });
});
