import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { fold1 } from './fold1';

describe('fold1', () => {
    it('should fold left over parsed items', () => {
        const stringParser = create<string>((input: string) => {
            if (input.length === 0) {
                return failure();
            }
            return success(input[0], input.slice(1));
        });

        const parser = fold1(stringParser, '', (acc, value) => acc + value);
        const result = parser('ABC');

        assertSuccess<string>(result, 'ABC', '');
    });

    it('should return null, one or more successful parser returns are required', () => {
        const failureParser = create<number>(() => failure());
        const parser = fold1(failureParser, 42, (acc, digit) => acc + digit);
        const result = parser('ABC');

        assertFailure<number>(result);
    });
});
