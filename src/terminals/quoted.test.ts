import { describe, expect, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { literal } from './literal';
import { quoted } from './quoted';

describe('quoted', () => {
    it('should parse double-quoted content', () => {
        const parser1 = literal('ABC');
        const parser = quoted(parser1);
        const result = parser('"ABC"');

        assertResult<'ABC'>(result, ['ABC', '']);
    });

    it('should parse single-quoted content', () => {
        const parser1 = literal('ABC');
        const parser = quoted(parser1);
        const result = parser("'ABC'");

        assertResult<'ABC'>(result, ['ABC', '']);
    });

    it('should fail with mismatched quotes', () => {
        const parser1 = literal('ABC');
        const parser = quoted(parser1);
        const result = parser('\'ABC"');

        assertResult<'ABC'>(result);
    });

    it('should handle empty quoted strings', () => {
        const parser1 = literal('');
        const parser = quoted(parser1);
        const result = parser('""');
        expect(result).toEqual(['', '']);

        assertResult<''>(result, ['', '']);
    });
});
