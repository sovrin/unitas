import { assertType, describe, expect, it } from 'vitest';

import { shift } from './shift';

describe('shift', () => {
    it('should return the first element of a string array', () => {
        const result = shift()(['a', 'b', 'c']);
        expect(result).toBe('a');
    });

    it('should return the first element of a number array', () => {
        const result = shift()([1, 2, 3]);
        expect(result).toBe(1);
    });

    it('should return the first element of a single-element array', () => {
        const result = shift()(['only']);
        expect(result).toBe('only');
    });

    it('should preserve type inference', () => {
        const result = shift()(['x', 1] as const);
        assertType<'x'>(result);
        expect(result).toBe('x');
    });
});
