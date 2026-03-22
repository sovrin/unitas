import { assertType, describe, expect, it } from 'vitest';

import { pick } from './pick';

describe('pick', () => {
    it('should pick elements at specified indexes', () => {
        {
            const result = pick(0, 2)(['a', 'b', 'c']);

            expect(result).toEqual(['a', 'c']);
        }
        {
            const result = pick(2, 4)(['a', 'b', 'c', 'd', 'e']);

            expect(result).toEqual(['c', 'e']);
        }
        {
            const result = pick(0, 1, 2)(['a', 'b', 'c']);

            expect(result).toEqual(['a', 'b', 'c']);
        }
    });

    it('should work with single index', () => {
        const result = pick(1)(['a', 'b', 'c']);

        expect(result).toEqual(['b']);
    });

    it('should work with out-of-order indexes', () => {
        const result = pick(3, 0, 1)(['a', 'b', 'c', 'd']);

        expect(result).toEqual(['d', 'a', 'b']);
    });

    it('should work with empty array', () => {
        const result = pick(0)([]);

        expect(result).toEqual([undefined]);
    });

    it('should preserve type inference', () => {
        {
            const result = pick(0, 3)(['a', 'b', 'c', 1, 2, 3]);
            assertType<readonly [string | number, string | number]>(result);
        }

        {
            const result = pick(0, 3)(['a', 'b', 'c', 1, 2, 3] as const);
            assertType<readonly ['a', 1]>(result);
        }
    });
});
