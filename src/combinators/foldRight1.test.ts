import { describe, it } from 'vitest';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { foldRight1 } from './foldRight1';
import { assertResult } from '../../test/utils.test';

describe('foldRight1', () => {
    const parser1 = create<string>((input: string) => {
        if (input.length === 0) {
            return failure();
        }
        return success(input[0], input.slice(1));
    });

    it('should fold right over parsed items', () => {
        const parser = foldRight1(
            parser1,
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertResult<string>(result, ['(((ZC)B)A)', '']);
    });

    it('should return null, one or more successful parser returns are required', () => {
        const parser1 = create<number>(() => failure());
        const parser = foldRight1(parser1, 42, (acc, digit) => acc + digit);
        const result = parser('ABC');

        assertResult<number>(result);
    });
});
