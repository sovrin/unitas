import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { letter, type Letter } from './letter';

describe('letter', () => {
    it('should parse alphabetic characters', () => {
        const result = letter('A' as const);

        assertSuccess<Letter>(result, 'A', '');
    });

    it('should fail on non-letter characters', () => {
        const result = letter('123' as never);

        assertFailure<unknown>(result);
    });

    it('should only parse first character', () => {
        const result = letter('hello' as never);

        assertSuccess<unknown>(result, 'h', 'ello');
    });

    it('should match the expected type', () => {
        const result = letter('A');

        assertSuccess<Letter>(result, 'A', '');
    });

    it('should narrow result to first character type for const string', () => {
        const result = letter('abc' as const);

        assertSuccess<'a'>(result, 'a', 'bc');
    });

    it('should narrow result type for uppercase const string', () => {
        const result = letter('XYZ' as const);

        assertSuccess<'X'>(result, 'X', 'YZ');
    });
});
