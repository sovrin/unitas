import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { eol } from './eol';

describe('eol', () => {
    it('should parse various line endings', () => {
        {
            const result = eol('\nabc');

            assertResult<string>(result, ['\n', 'abc']);
        }
        {
            const result = eol('\r\nabc');

            assertResult<string>(result, ['\r\n', 'abc']);
        }
    });

    it('should handle end of file', () => {
        const result = eol('');

        assertResult<string>(result, ['', '']);
    });

    it('should prefer CRLF over individual characters', () => {
        const result = eol('\r\n');

        assertResult<string>(result, ['\r\n', '']);
    });
});
