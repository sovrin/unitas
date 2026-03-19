import { assertType, describe, expect, it } from 'vitest';

import { pop } from './pop';

describe('pop', () => {
    it('should return the last element of a string array', () => {
        const result = pop()(['a', 'b', 'c']);
        expect(result).toBe('c');
    });

    it('should return the last element of a number array', () => {
        const result = pop()([1, 2, 3]);
        expect(result).toBe(3);
    });

    it('should return the last element of a single-element array', () => {
        const result = pop()(['only']);
        expect(result).toBe('only');
    });

    it('should preserve type inference', () => {
        {
            const result = pop()(['x', 'y', 'z']);
            assertType<string>(result);
        }
        {
            const result = pop()([1, 2, 3]);
            assertType<number>(result);
        }
    });
});
