import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { digits } from './digits';

describe('digits', () => {
    it('should parse multiple digits and return number', () => {
        {
            const result = digits('123abc');

            assertSuccess<number>(result, 123, 3);
        }
        {
            const result = digits('42');

            assertSuccess<number>(result, 42, 2);
        }
        {
            const result = digits('007xyz');

            assertSuccess<number>(result, 7, 3);
        }
    });

    it('should fail when no digits found', () => {
        {
            const result = digits('abc');

            assertFailure<number>(result);
        }
        {
            const result = digits('');

            assertFailure<number>(result);
        }
    });

    it('should handle single digit', () => {
        const result = digits('5abc');

        assertSuccess<number>(result, 5, 1);
    });
});
