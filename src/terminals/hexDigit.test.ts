import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { hexDigit } from './hexDigit';

describe('hexDigit', () => {
    it('should parse hexadecimal digits', () => {
        const result = hexDigit('fF9');
        assertSuccess<string>(result, 'f', 'F9');
    });

    it('should fail on non-hexadecimal', () => {
        const result = hexDigit('gabc');
        assertFailure<string>(result);
    });

    it('should fail on empty input', () => {
        const result = hexDigit('');
        assertFailure<string>(result);
    });
});
