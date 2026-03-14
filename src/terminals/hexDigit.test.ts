import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { hexDigit } from './hexDigit';

describe('hexDigit', () => {
    it('should parse hexadecimal digits', () => {
        const result = hexDigit('fF9');
        assertResult<string>(result, ['f', 'F9']);
    });

    it('should fail on non-hexadecimal', () => {
        const result = hexDigit('gabc');
        assertResult<string>(result);
    });

    it('should fail on empty input', () => {
        const result = hexDigit('');
        assertResult<string>(result);
    });
});
