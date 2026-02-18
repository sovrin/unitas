import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { crlf } from './crlf';

describe('crlf', () => {
    it('should parse CRLF sequence', () => {
        const result = crlf('\r\nabc');

        assertResult<string>(result, ['\r\n', 'abc']);
    });

    it('should fail on single CR or LF', () => {
        {
            const result = crlf('\rabc');

            assertResult<string>(result);
        }
        {
            const result = crlf('\nabc');

            assertResult<string>(result);
        }
    });

    it('should fail on other characters', () => {
        const result = crlf('abc');

        assertResult<string>(result);
    });
});
