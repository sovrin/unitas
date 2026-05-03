import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { quoted } from './quoted';

describe('quoted', () => {
    it('should parse double-quoted content', () => {
        const parser = quoted(createTestParser('ABC'));
        const result = parser('"ABC"');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should parse single-quoted content', () => {
        const parser = quoted(createTestParser('ABC'));
        const result = parser("'ABC'");

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with mismatched quotes', () => {
        const parser = quoted(createTestParser('ABC'));
        const result = parser('\'ABC"');

        assertFailure<'ABC'>(result);
    });

    it('should leave remaining input', () => {
        const parser = quoted(createTestParser('ABC'));
        const result = parser('"ABC"rest');

        assertSuccess<'ABC'>(result, 'ABC', 'rest');
    });

    it('should handle empty quotes input', () => {
        const parser = quoted(createTestParser(''));
        const result = parser('""');

        assertSuccess<''>(result, '', '');
    });
});
