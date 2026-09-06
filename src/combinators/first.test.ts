import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { create } from '../core/parser';
import { success } from '../core/success';
import { first } from './first';

describe('first', () => {
    it('should return first element of array parser result', () => {
        const parser1 = create((input) => success(['A', 'B', 'C'] as const, input.length));
        const parser = first(parser1);
        const result = parser('ABC');

        assertSuccess<'A'>(result, 'A', 3);
    });

    it('should return undefined for empty array', () => {
        const parser1 = create((_input, _index = 0) => success([] as const, 0));
        const parser = first(parser1);
        const result = parser('ABC');

        assertSuccess<undefined>(result, undefined, 0);
    });
});
