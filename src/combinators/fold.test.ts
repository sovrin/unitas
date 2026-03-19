import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { fold } from './fold';

describe('fold', () => {
    const stringParser = create<string>((input: string) => {
        if (input.length === 0) {
            return failure();
        }
        return success(input[0], input.slice(1));
    });

    it('should fold left over parsed items', () => {
        const parser = fold(
            stringParser,
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertSuccess<string>(result, '(((ZA)B)C)', '');
    });

    it('should work with empty input (return initial value and not consume input)', () => {
        const parser = fold(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertSuccess<string>(result, 'Z', 'ABC');
    });

    it('should work with empty input (return initial value)', () => {
        const parser = fold(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('');

        assertSuccess<string>(result, 'Z', '');
    });

    it('should work with complex accumulator types', () => {
        const parser = fold(
            stringParser,
            { label: '', count: 0 },
            (acc, label) => ({
                label: acc.label + label,
                count: acc.count + 1,
            }),
        );
        const result = parser('ABC');

        assertSuccess<{
            label: string;
            count: number;
        }>(result, { label: 'ABC', count: 3 }, '');
    });

    it('should work with array building', () => {
        const parser = fold(stringParser, [] as string[], (acc, digit) => [
            ...acc,
            digit + 'Z',
        ]);
        const result = parser('ABC');

        assertSuccess<string[]>(result, ['AZ', 'BZ', 'CZ'], '');
    });

    it('should not fail and return the initial value and not consume', () => {
        const failureParser = create(() => failure());
        const parser = fold(failureParser, 0, (acc) => acc + 1);
        const result = parser('ABC');

        assertSuccess<number>(result, 0, 'ABC');
    });
});
