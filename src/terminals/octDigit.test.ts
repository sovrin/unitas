import { describe, it } from 'vitest';

import type { OctDigit } from '../types';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { octDigit } from './octDigit';

describe('octDigit', () => {
    it('should parse octal digits', () => {
        const result = octDigit('712');
        assertSuccess<OctDigit>(result, '7', '12');
    });

    it('should fail on non-octal', () => {
        const result = octDigit('8abc');
        assertFailure<OctDigit>(result);
    });

    it('should fail on empty input', () => {
        const result = octDigit('');
        assertFailure<OctDigit>(result);
    });

    it('should narrow result to first character type for const string', () => {
        const result = octDigit('37x' as const);
        assertSuccess<'3'>(result, '3', '7x');
    });
});
