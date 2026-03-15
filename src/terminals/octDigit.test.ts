import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { octDigit } from './octDigit';

describe('octDigit', () => {
    it('should parse octal digits', () => {
        const result = octDigit('712');
        assertSuccess<string>(result, '7', '12');
    });

    it('should fail on non-octal', () => {
        const result = octDigit('8abc');
        assertFailure<string>(result);
    });

    it('should fail on empty input', () => {
        const result = octDigit('');
        assertFailure<string>(result);
    });
});
