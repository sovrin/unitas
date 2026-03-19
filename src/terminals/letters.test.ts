import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { letters } from './letters';

describe('letters', () => {
    it('should parse multiple letters and return string', () => {
        {
            const result = letters('abc123');

            assertSuccess<string>(result, 'abc', '123');
        }
        {
            const result = letters('Hello World');

            assertSuccess<string>(result, 'Hello', ' World');
        }
        {
            const result = letters('ABC');

            assertSuccess<string>(result, 'ABC', '');
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

        assertSuccess<string>(result, 'a', '1b2');
    });
});
