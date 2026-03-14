import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { octDigit } from './octDigit';

describe('octDigit', () => {
    it('should parse octal digits', () => {
        const result = octDigit('712');
        assertResult<string>(result, ['7', '12']);
    });

    it('should fail on non-octal', () => {
        const result = octDigit('8abc');
        assertResult<string>(result);
    });

    it('should fail on empty input', () => {
        const result = octDigit('');
        assertResult<string>(result);
    });
});
