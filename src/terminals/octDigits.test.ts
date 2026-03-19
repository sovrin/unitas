import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { octDigits } from './octDigits';

describe('octDigits', () => {
    it('should parse multiple octal digits and return string', () => {
        {
            const result = octDigits('0777rest');

            assertSuccess<string>(result, '0777', 'rest');
        }
        {
            const result = octDigits('1234567');

            assertSuccess<string>(result, '1234567', '');
        }
        {
            const result = octDigits('042 end');

            assertSuccess<string>(result, '042', ' end');
        }
    });

    it('should fail when no octal digits found', () => {
        {
            const result = octDigits('8abc');

            assertFailure<string>(result);
        }
        {
            const result = octDigits('');

            assertFailure<string>(result);
        }
        {
            const result = octDigits('!012');

            assertFailure<string>(result);
        }
    });

    it('should handle single octal digit', () => {
        const result = octDigits('7rest');

        assertSuccess<string>(result, '7', 'rest');
    });

    it('should stop at first non-octal character', () => {
        const result = octDigits('0128');

        assertSuccess<string>(result, '012', '8');
    });
});
