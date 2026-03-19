import { assertType, describe, expect, it } from 'vitest';

import { spread } from './spread';

describe('spread', () => {
    it('should return the arguments as an array', () => {
        const result = spread()('a', 'b', 'c');
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should work with numbers', () => {
        const result = spread()(1, 2, 3);
        expect(result).toEqual([1, 2, 3]);
    });

    it('should work with a single argument', () => {
        const result = spread()('only');
        expect(result).toEqual(['only']);
    });

    it('should return empty array when called with no arguments', () => {
        const result = spread()();
        expect(result).toEqual([]);
    });

    it('should preserve type inference', () => {
        const result = spread()('x', 'y', 'z');
        assertType<readonly string[]>(result);
    });
});
