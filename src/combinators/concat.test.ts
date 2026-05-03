import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { concat } from './concat';

const abcParser = create<string[]>((input) => {
    if (input.startsWith('abc')) {
        return success(['a', 'b', 'c'], input.slice(3));
    }

    return failure();
});

const emptyParser = create<string[]>((input) => success([], input));

describe('concat', () => {
    it('should join array results into string', () => {
        const parser = concat(abcParser);
        const result = parser('abc');

        assertSuccess<string>(result, 'abc', '');
    });

    it('should join with separator', () => {
        const parser = concat(abcParser, '-');
        const result = parser('abc');

        assertSuccess<string>(result, 'a-b-c', '');
    });

    it('should return empty string for empty array', () => {
        const parser = concat(emptyParser);
        const result = parser('xyz');

        assertSuccess<string>(result, '', 'xyz');
    });
});
