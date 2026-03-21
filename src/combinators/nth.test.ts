import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { create } from '../core/parser';
import { success } from '../core/success';
import { nth } from './nth';

describe('nth', () => {
    it('should return element at specified index', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));

        {
            const parser = nth(parser1, 0);
            const result = parser('ABC');

            assertSuccess<'A'>(result, 'A', '');
        }
        {
            const parser = nth(parser1, 1);
            const result = parser('ABC');

            assertSuccess<'B'>(result, 'B', '');
        }
        {
            const parser = nth(parser1, 2);
            const result = parser('ABC');

            assertSuccess<'C'>(result, 'C', '');
        }
    });

    it('should return undefined for out-of-bounds index', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));

        {
            const parser = nth(parser1, 5);
            const result = parser('ABC');

            assertSuccess<undefined>(result, undefined, '');
        }

        {
            const parser = nth(parser1, -1);
            const result = parser('ABC');

            assertSuccess<undefined>(result, undefined, '');
        }
    });

    it('should handle empty arrays', () => {
        const parser1 = create(() => success([] as const, 'ABC'));
        const parser = nth(parser1, 1);
        const result = parser('');

        assertSuccess<undefined>(result, undefined, 'ABC');
    });
});
