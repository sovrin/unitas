import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { nl } from './nl';

describe('nl', () => {
    it('should parse newline character', () => {
        const result = nl('\nabc');

        assertSuccess<'\n'>(result, '\n', 'abc');
    });

    it('should fail on non-newline characters', () => {
        {
            const result = nl('\rabc');

            assertFailure<'\n'>(result);
        }
        {
            const result = nl(' abc');

            assertFailure<'\n'>(result);
        }
        {
            const result = nl('abc');

            assertFailure<'\n'>(result);
        }
    });
});
