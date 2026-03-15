import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { eol } from './eol';

describe('eol', () => {
    it('should parse various line endings', () => {
        {
            const result = eol('\nabc');

            assertSuccess<string>(result, '\n', 'abc');
        }
        {
            const result = eol('\r\nabc');

            assertSuccess<string>(result, '\r\n', 'abc');
        }
    });

    it('should handle end of file', () => {
        const result = eol('');

        assertSuccess<string>(result, '', '');
    });

    it('should prefer CRLF over individual characters', () => {
        const result = eol('\r\n');

        assertSuccess<string>(result, '\r\n', '');
    });
});
