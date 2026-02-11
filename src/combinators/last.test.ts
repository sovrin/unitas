import { describe, it } from 'vitest';
import { create } from '../core/create';
import { last } from './last';
import { success } from '../core/success';
import { assertResult } from '../../test/utils.test';

describe('last', () => {
    it('should return last element of array parser result', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));
        const parser = last(parser1);
        const result = parser('ABC');

        assertResult<'C'>(result, ['C', '']);
    });

    it('should return undefined for empty array', () => {
        const parser1 = create(() =>
            success([] as unknown as [unknown, ...unknown[]], 'ABC'),
        );
        const parser = last(parser1);
        const result = parser('ABC');

        assertResult<undefined>(result, [undefined, 'ABC']);
    });
});
