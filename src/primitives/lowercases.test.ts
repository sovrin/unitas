import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { lowercases } from './lowercases';

describe('lowercases', () => {
    it('should parse a run of lowercase letters', () => {
        {
            const result = lowercases('abcDEF');

            assertSuccess<string>(result, 'abc', 3);
        }
        {
            const result = lowercases('hello world');

            assertSuccess<string>(result, 'hello', 5);
        }
        {
            const result = lowercases('abc');

            assertSuccess<string>(result, 'abc', 3);
        }
    });

    it('should fail when no lowercase letters found', () => {
        {
            const result = lowercases('ABC');

            assertFailure<string>(result);
        }
        {
            const result = lowercases('123');

            assertFailure<string>(result);
        }
        {
            const result = lowercases('');

            assertFailure<string>(result);
        }
    });

    it('should handle single lowercase letter', () => {
        const result = lowercases('aBC');

        assertSuccess<string>(result, 'a', 1);
    });
});
