import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { create } from '../core/parser';
import { success } from '../core/success';
import { nth } from './nth';

describe('nth', () => {
    it('should return element at specified index', () => {
        const parser1 = create((input) => success(['A', 'B', 'C'] as const, input.length));

        {
            const parser = nth(parser1, 0);
            const result = parser('ABC');

            assertSuccess<'A'>(result, 'A', 3);
        }
        {
            const parser = nth(parser1, 1);
            const result = parser('ABC');

            assertSuccess<'B'>(result, 'B', 3);
        }
        {
            const parser = nth(parser1, 2);
            const result = parser('ABC');

            assertSuccess<'C'>(result, 'C', 3);
        }
    });

    it('should return undefined for out-of-bounds index', () => {
        const parser1 = create((_input, _index = 0) => success(['A', 'B', 'C'] as const, 3));

        {
            const parser = nth(parser1, 5);
            const result = parser('ABC');

            assertSuccess<undefined>(result, undefined, 3);
        }

        {
            const parser = nth(parser1, -1);
            const result = parser('ABC');

            assertSuccess<undefined>(result, undefined, 3);
        }
    });

    it('should handle empty arrays', () => {
        const parser1 = create((_input, _index = 0) => success([] as const, 0));
        const parser = nth(parser1, 1);
        const result = parser('');

        assertSuccess<undefined>(result, undefined, 0);
    });
});
