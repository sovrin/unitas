import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { crlf } from './crlf';

describe('crlf', () => {
    it('should parse CRLF sequence', () => {
        const result = crlf('\r\nabc');

        assertSuccess<string>(result, '\r\n', 'abc');
    });

    it('should fail on single CR or LF', () => {
        {
            const result = crlf('\rabc');

            assertFailure<string>(result);
        }
        {
            const result = crlf('\nabc');

            assertFailure<string>(result);
        }
    });

    it('should fail on other characters', () => {
        const result = crlf('abc');

        assertFailure<string>(result);
    });
});
