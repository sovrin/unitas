import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { fold1 } from './fold1';

describe('fold1', () => {
    it('should fold left over parsed items', () => {
        const stringParser = create<string>((input, index = 0) => {
            if (index >= input.length) {
                return failure(index);
            }
            return success(input[index], index + 1);
        });

        const parser = fold1(stringParser, '', (acc, value) => acc + value);
        const result = parser('ABC');

        assertSuccess<string>(result, 'ABC', 3);
    });

    it('should return null, one or more successful parser returns are required', () => {
        const failureParser = create<number>((_input, index = 0) => failure(index));
        const parser = fold1(failureParser, 42, (acc, digit) => acc + digit);
        const result = parser('ABC');

        assertFailure<number>(result);
    });
});
