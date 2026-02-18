import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { digits } from './digits';

describe('digits', () => {
    it('should parse multiple digits and return number', () => {
        {
            const result = digits('123abc');

            assertResult<number>(result, [123, 'abc']);
        }
        {
            const result = digits('42');

            assertResult<number>(result, [42, '']);
        }
        {
            const result = digits('007xyz');

            assertResult<number>(result, [7, 'xyz']);
        }
    });

    it('should fail when no digits found', () => {
        {
            const result = digits('abc');

            assertResult<number>(result);
        }
        {
            const result = digits('');

            assertResult<number>(result);
        }
    });

    it('should handle single digit', () => {
        const result = digits('5abc');

        assertResult<number>(result, [5, 'abc']);
    });
});
