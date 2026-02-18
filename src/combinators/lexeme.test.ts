import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { lexeme } from './lexeme';

describe('lexeme', () => {
    it('should parse a token and consume trailing whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A       B');

        assertResult<'A'>(result, ['A', 'B']);
    });

    it('should parse a token with no trailing whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('AB');

        assertResult<'A'>(result, ['A', 'B']);
    });

    it('should consume various types of whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A \t\n\r  B');

        assertResult<'A'>(result, ['A', 'B']);
    });

    it('should fail when the underlying parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('B');

        assertResult<'A'>(result);
    });

    it('should handle empty input after consuming whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A   ');

        assertResult<'A'>(result, ['A', '']);
    });
});
