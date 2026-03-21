import { describe, expect, it } from 'vitest';

import { literal } from '../terminals';
import { filter } from './filter';

describe('filter', () => {
    it('should filter out specified values', () => {
        const values = ['a', 'b', 'c'] as const;
        const result = filter(values)(['a', 'b', 'c', 'd', 'e']);
        expect(result).toEqual(['d', 'e']);
    });

    it('should filter out specified numbers', () => {
        const values = [1, 2, 3] as const;
        const result = filter(values)([1, 2, 3, 4, 5]);
        expect(result).toEqual([4, 5]);
    });

    it('should return empty array when all values are filtered', () => {
        const values = ['x', 'y', 'z'] as const;
        const result = filter(values)(['x', 'y', 'z']);
        expect(result).toEqual([]);
    });

    it('should return original array when no values match', () => {
        const values = ['z'] as const;
        const result = filter(values)(['a', 'b', 'c']);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty values array', () => {
        const values = [] as const;
        const result = filter(values)(['a', 'b', 'c']);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty haystack', () => {
        const values = ['a', 'b'] as const;
        const result = filter(values)([]);
        expect(result).toEqual([]);
    });

    it('should handle strict mode filtering', () => {
        const values = ['a', 'b', ''] as const;
        const result = filter(values, true)(['a', 'b', '', 'c', '']);
        expect(result).toEqual(['c']);
    });

    it('should handle strict mode with falsy numbers', () => {
        const values = [0, null] as const;
        const result = filter(values, true)([0, 1, null, 2, undefined, 3]);
        expect(result).toEqual([1, 2, 3]);
    });

    it('should handle mixed types in haystack', () => {
        const values = [1, 'b'] as const;
        const result = filter(values)([1, 'b', 2, 'c', null]);
        expect(result).toEqual([2, 'c', null]);
    });

    it('should handle duplicate values in haystack', () => {
        const values = ['a'] as const;
        const result = filter(values)(['a', 'a', 'a', 'b', 'a']);
        expect(result).toEqual(['b']);
    });

    it('foo', () => {
        const a = literal('a');
        const b = literal('b');

        const values = [a, b] as const;
        const result = filter(values)(['a', a, 'a', 'b', 'a']);
        expect(result).toEqual(['b']);
    });
});
