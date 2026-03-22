import { describe, expect, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { char } from '../terminals/char';
import { digits } from '../terminals/digits';
import { memoize } from './memoize';

describe('memoize', () => {
    it('should return the same result for the same input', () => {
        const parser = memoize(digits);
        const result1 = parser('123');
        const result2 = parser('123');

        expect(result1).toBe(result2);
    });

    it('should cache results', () => {
        let callCount = 0;
        const countingParser = (input: string) => {
            callCount++;
            return digits(input);
        };

        const memoParser = memoize(countingParser);

        memoParser('123');
        memoParser('123');
        memoParser('456');

        expect(callCount).toBe(2); // '123' called once, '456' called once
    });

    it('should not interfere with different inputs', () => {
        const parser = memoize(digits);

        const result1 = parser('123');
        const result2 = parser('456');

        assertSuccess(result1, 123, '');
        assertSuccess(result2, 456, '');
    });

    it('should work with char parser', () => {
        const parser = memoize(char('x'));

        const result1 = parser('xyz');
        const result2 = parser('xyz');

        assertSuccess(result1, 'x', 'yz');
        expect(result1).toBe(result2);
    });
});
