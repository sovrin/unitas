import { assertType, describe, expect, it } from 'vitest';

import { flatten } from './flatten';

describe('flatten', () => {
    it('should flatten a nested array by one level', () => {
        const result = flatten()([
            ['a', 'b'],
            ['c', 'd'],
        ]);
        expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should flatten a nested number array by one level', () => {
        const result = flatten()([
            [1, 2],
            [3, 4],
        ]);
        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should preserve type inference for string arrays', () => {
        const result = flatten()([['x'], ['y', 'z']] as const);
        assertType<('x' | 'y' | 'z')[]>(result);
    });

    it('should handle single nested array', () => {
        const result = flatten()([['only']]);
        expect(result).toEqual(['only']);
    });

    it('should handle empty inner arrays', () => {
        const result = flatten()([['a'], [], ['b']]);
        expect(result).toEqual(['a', 'b']);
    });
});
