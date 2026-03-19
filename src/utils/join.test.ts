import { assertType, describe, expect, it } from 'vitest';

import { join } from './join';

describe('join', () => {
    it('should join string array into a single string', () => {
        const result = join()(['a', 'b', 'c']);
        expect(result).toBe('abc');
    });

    it('should join number array into a string', () => {
        const result = join()([1, 2, 3]);
        expect(result).toBe('123');
    });

    it('should join string array with custom separator', () => {
        const result = join('_')(['a', 'b', 'c']);
        expect(result).toBe('a_b_c');
    });

    it('should handle single element array', () => {
        const result = join()(['only']);
        expect(result).toBe('only');
    });

    it('should handle empty array', () => {
        const result = join()([]);
        expect(result).toBe('');
    });

    it('should return string type', () => {
        const result = join()(['x', 'y', 'z']);
        assertType<string>(result);
        expect(result).toBe('xyz');
    });
});
