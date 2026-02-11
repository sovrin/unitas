import { describe, it } from 'vitest';
import { create } from '../core/create';
import { success } from '../core/success';
import { nth } from './nth';
import { assertResult } from '../../test/utils.test';

describe('nth', () => {
    it('should return element at specified index', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));

        {
            const parser = nth(parser1, 0);
            const result = parser('ABC');

            assertResult<'A'>(result, ['A', '']);
        }
        {
            const parser = nth(parser1, 1);
            const result = parser('ABC');

            assertResult<'B'>(result, ['B', '']);
        }
        {
            const parser = nth(parser1, 2);
            const result = parser('ABC');

            assertResult<'C'>(result, ['C', '']);
        }
    });

    it('should return undefined for out-of-bounds index', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));

        {
            const parser = nth(parser1, 5);
            const result = parser('ABC');

            assertResult<undefined>(result, [undefined, '']);
        }

        {
            const parser = nth(parser1, -1);
            const result = parser('ABC');

            assertResult<undefined>(result, [undefined, '']);
        }
    });

    it('should handle empty arrays', () => {
        const parser1 = create(() => success([] as const, 'ABC'));
        const parser = nth(parser1, 1);
        const result = parser('');

        assertResult<undefined>(result, [undefined, 'ABC']);
    });
});
