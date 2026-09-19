import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { hexDigits } from './hexDigits';

describe('hexDigits', () => {
    it('should parse multiple hex digits and return string', () => {
        {
            const result = hexDigits('1a2bXY');

            assertSuccess<string>(result, '1a2b', 4);
        }
        {
            const result = hexDigits('DEADBEEF');

            assertSuccess<string>(result, 'DEADBEEF', 8);
        }
        {
            const result = hexDigits('ff00ff rest');

            assertSuccess<string>(result, 'ff00ff', 6);
        }
    });

    it('should fail when no hex digits found', () => {
        {
            const result = hexDigits('xyz');

            assertFailure<string>(result);
        }
        {
            const result = hexDigits('');

            assertFailure<string>(result);
        }
        {
            const result = hexDigits('!abc');

            assertFailure<string>(result);
        }
    });

    it('should handle single hex digit', () => {
        const result = hexDigits('fXY');

        assertSuccess<string>(result, 'f', 1);
    });

    it('should stop at first non-hex character', () => {
        const result = hexDigits('a1g9');

        assertSuccess<string>(result, 'a1', 2);
    });
});
