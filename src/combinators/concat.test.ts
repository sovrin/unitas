import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { concat } from './concat';

const abcParser = create<string[]>((input, index = 0) => {
    if (input.startsWith('abc', index)) {
        return success(['a', 'b', 'c'], index + 3);
    }

    return failure(undefined, index);
});

const emptyParser = create<string[]>((input, index = 0) => success([], index));

describe('concat', () => {
    it('should join array results into string', () => {
        const parser = concat(abcParser);
        const result = parser('abc');

        assertSuccess<string>(result, 'abc', 3);
    });

    it('should join with separator', () => {
        const parser = concat(abcParser, '-');
        const result = parser('abc');

        assertSuccess<string>(result, 'a-b-c', 3);
    });

    it('should return empty string for empty array', () => {
        const parser = concat(emptyParser);
        const result = parser('xyz');

        assertSuccess<string>(result, '', 0);
    });
});
