import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { nl } from './nl';

describe('nl', () => {
    it('should parse newline character', () => {
        const result = nl('\nabc');

        assertResult<'\n'>(result, ['\n', 'abc']);
    });

    it('should fail on non-newline characters', () => {
        {
            const result = nl('\rabc');

            assertResult<'\n'>(result);
        }
        {
            const result = nl(' abc');

            assertResult<'\n'>(result);
        }
        {
            const result = nl('abc');

            assertResult<'\n'>(result);
        }
    });
});
