import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { digit } from './digit';

describe('digit', () => {
    it('should parse single digit and return number', () => {
        {
            const result = digit('5abc');

            assertResult<number>(result, [5, 'abc']);
        }
        {
            const result = digit('0xyz');

            assertResult<number>(result, [0, 'xyz']);
        }
        {
            const result = digit('9');

            assertResult<number>(result, [9, '']);
        }
    });

    it('should fail on non-digit characters', () => {
        {
            const result = digit('abc');

            assertResult<number>(result);
        }
        {
            const result = digit('!');

            assertResult<number>(result);
        }
        {
            const result = digit('');

            assertResult<number>(result);
        }
    });

    it('should only parse first digit', () => {
        const result = digit('123');

        assertResult<number>(result, [1, '23']);
    });
});
