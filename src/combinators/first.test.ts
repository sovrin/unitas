import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { create } from '../core/parser';
import { success } from '../core/success';
import { first } from './first';

describe('first', () => {
    it('should return first element of array parser result', () => {
        const parser1 = create(() => success(['A', 'B', 'C'] as const, ''));
        const parser = first(parser1);
        const result = parser('ABC');

        assertSuccess<'A'>(result, 'A', '');
    });

    it('should return undefined for empty array', () => {
        const parser1 = create(() => success([] as const, 'ABC'));
        const parser = first(parser1);
        const result = parser('ABC');

        assertSuccess<undefined>(result, undefined, 'ABC');
    });
});
