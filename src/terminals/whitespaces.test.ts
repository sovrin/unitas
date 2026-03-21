import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { whitespaces } from './whitespaces';

describe('whitespaces', () => {
    it('should parse a run of whitespace characters', () => {
        {
            const result = whitespaces('   abc');

            assertSuccess<string>(result, '   ', 'abc');
        }
        {
            const result = whitespaces(' \t\n end');

            assertSuccess<string>(result, ' \t\n ', 'end');
        }
        {
            const result = whitespaces('   ');

            assertSuccess<string>(result, '   ', '');
        }
    });

    it('should fail when no whitespace found', () => {
        {
            const result = whitespaces('abc');

            assertFailure<string>(result);
        }
        {
            const result = whitespaces('');

            assertFailure<string>(result);
        }
    });

    it('should handle single whitespace character', () => {
        const result = whitespaces(' abc');

        assertSuccess<string>(result, ' ', 'abc');
    });
});
