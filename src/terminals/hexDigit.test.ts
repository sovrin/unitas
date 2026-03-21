import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { hexDigit, type HexDigit } from './hexDigit';

describe('hexDigit', () => {
    it('should parse hexadecimal digits', () => {
        const result = hexDigit('fF9');
        assertSuccess<HexDigit>(result, 'f', 'F9');
    });

    it('should fail on non-hexadecimal', () => {
        const result = hexDigit('gabc');
        assertFailure<HexDigit>(result);
    });

    it('should fail on empty input', () => {
        const result = hexDigit('');
        assertFailure<HexDigit>(result);
    });

    it('should narrow result to first character type for const string', () => {
        const result = hexDigit('f1a' as const);
        assertSuccess<'f'>(result, 'f', '1a');
    });

    it('should narrow result for uppercase hex const string', () => {
        const result = hexDigit('A2B' as const);
        assertSuccess<'A'>(result, 'A', '2B');
    });
});
