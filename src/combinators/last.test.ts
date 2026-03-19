import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { create } from '../core/parser';
import { success } from '../core/success';
import { last } from './last';

describe('last', () => {
    it('should return last element of array parser result', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));
        const parser = last(parser1);
        const result = parser('ABC');

        assertSuccess<'C'>(result, 'C', '');
    });

    it('should return undefined for empty array', () => {
        const parser1 = create(() =>
            success([] as unknown as [unknown, ...unknown[]], 'ABC'),
        );
        const parser = last(parser1);
        const result = parser('ABC');

        assertSuccess<undefined>(result, undefined, 'ABC');
    });
});
