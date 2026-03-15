import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { lexeme } from './lexeme';

describe('lexeme', () => {
    it('should parse a token and consume trailing whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A       B');

        assertSuccess<'A'>(result, 'A', 'B');
    });

    it('should parse a token with no trailing whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('AB');

        assertSuccess<'A'>(result, 'A', 'B');
    });

    it('should consume various types of whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A \t\n\r  B');

        assertSuccess<'A'>(result, 'A', 'B');
    });

    it('should fail when the underlying parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('B');

        assertFailure<'A'>(result);
    });

    it('should handle empty input after consuming whitespace', () => {
        const parser1 = createTestParser('A');
        const parser = lexeme(parser1);
        const result = parser('A   ');

        assertSuccess<'A'>(result, 'A', '');
    });
});
