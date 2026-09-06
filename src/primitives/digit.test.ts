import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { digit } from './digit';

describe('digit', () => {
    it('should parse single digit and return number', () => {
        {
            const result = digit('5abc');

            assertSuccess<number>(result, 5, 1);
        }
        {
            const result = digit('0xyz');

            assertSuccess<number>(result, 0, 1);
        }
        {
            const result = digit('9');

            assertSuccess<number>(result, 9, 1);
        }
    });

    it('should fail on non-digit characters', () => {
        {
            const result = digit('abc');

            assertFailure<number>(result);
        }
        {
            const result = digit('!');

            assertFailure<number>(result);
        }
        {
            const result = digit('');

            assertFailure<number>(result);
        }
    });

    it('should only parse first digit', () => {
        const result = digit('123');

        assertSuccess<number>(result, 1, 1);
    });
});
