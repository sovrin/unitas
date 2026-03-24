import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { string } from '../terminals/string';
import { quoted } from './quoted';

describe('quoted', () => {
    it('should parse double-quoted content', () => {
        const parser1 = string('ABC');
        const parser = quoted(parser1);
        const result = parser('"ABC"');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should parse single-quoted content', () => {
        const parser1 = string('ABC');
        const parser = quoted(parser1);
        const result = parser("'ABC'");

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with mismatched quotes', () => {
        const parser1 = string('ABC');
        const parser = quoted(parser1);
        const result = parser('\'ABC"');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty quoted strings', () => {
        const parser1 = string('');
        const parser = quoted(parser1);
        const result = parser('""');

        assertSuccess<''>(result, '', '');
    });
});
