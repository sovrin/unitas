import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { letters } from './letters';

describe('letters', () => {
    it('should parse multiple letters and return string', () => {
        {
            const result = letters('abc123');

            assertSuccess<string>(result, 'abc', 3);
        }
        {
            const result = letters('Hello World');

            assertSuccess<string>(result, 'Hello', 5);
        }
        {
            const result = letters('ABC');

            assertSuccess<string>(result, 'ABC', 3);
        }
    });

    it('should fail when no letters found', () => {
        {
            const result = letters('123abc');

            assertFailure<string>(result);
        }
        {
            const result = letters('');

            assertFailure<string>(result);
        }
        {
            const result = letters('!hello');

            assertFailure<string>(result);
        }
    });

    it('should handle single letter', () => {
        const result = letters('a1b2');

        assertSuccess<string>(result, 'a', 1);
    });
});
