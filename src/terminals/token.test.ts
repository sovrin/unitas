import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { token } from './token';

describe('token', () => {
    it('should parse a symbol and consume trailing whitespace', () => {
        const parser = token('if');
        const result = parser('if   (condition)');

        assertSuccess<'if'>(result, 'if', '(condition)');
    });

    it('should parse operators with whitespace', () => {
        const parser = token('==');
        const result = parser('==  value');

        assertSuccess<'=='>(result, '==', 'value');
    });

    it('should parse punctuation symbols', () => {
        const parser = token('(');
        const result = parser('(  )');

        assertSuccess<'('>(result, '(', ')');
    });

    it('should fail when symbol does not match', () => {
        const parser = token('while');
        const result = parser('if (condition)');

        assertFailure<'while'>(result);
    });

    it('should parse symbol with no trailing whitespace', () => {
        const parser = token(';');
        const result = parser(';next');

        assertSuccess<';'>(result, ';', 'next');
    });

    it('should handle multi-character symbols', () => {
        const parser = token('<=');
        const result = parser('<=  100');

        assertSuccess<'<='>(result, '<=', '100');
    });

    it('should work with empty string symbol', () => {
        const parser = token('');
        const result = parser('   anything');

        assertSuccess<''>(result, '', 'anything');
    });
});
