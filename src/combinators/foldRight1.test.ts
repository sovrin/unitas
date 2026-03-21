import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { foldRight1 } from './foldRight1';

describe('foldRight1', () => {
    const stringParser = create<string>((input: string) => {
        if (input.length === 0) {
            return failure();
        }
        return success(input[0], input.slice(1));
    });

    it('should fold right over parsed items', () => {
        const parser = foldRight1(
            stringParser,
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertSuccess<string>(result, '(((ZC)B)A)', '');
    });

    it('should return null, one or more successful parser returns are required', () => {
        const failureParser = create<number>(() => failure());
        const parser = foldRight1(
            failureParser,
            42,
            (acc, digit) => acc + digit,
        );
        const result = parser('ABC');

        assertFailure<number>(result);
    });
});
