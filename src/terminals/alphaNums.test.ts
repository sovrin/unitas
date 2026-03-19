import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { alphaNums } from './alphaNums';

describe('alphaNums', () => {
    it('should parse a run of alphanumeric characters', () => {
        {
            const result = alphaNums('abc123 rest');

            assertSuccess<string>(result, 'abc123', ' rest');
        }
        {
            const result = alphaNums('Hello2World!');

            assertSuccess<string>(result, 'Hello2World', '!');
        }
        {
            const result = alphaNums('abc123');

            assertSuccess<string>(result, 'abc123', '');
        }
    });

    it('should fail when no alphanumeric characters found', () => {
        {
            const result = alphaNums('!abc');

            assertFailure<string>(result);
        }
        {
            const result = alphaNums(' abc');

            assertFailure<string>(result);
        }
        {
            const result = alphaNums('');

            assertFailure<string>(result);
        }
    });

    it('should handle single alphanumeric character', () => {
        const result = alphaNums('a!');

        assertSuccess<string>(result, 'a', '!');
    });

    it('should stop at first non-alphanumeric character', () => {
        const result = alphaNums('abc_def');

        assertSuccess<string>(result, 'abc', '_def');
    });
});
