import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { foldRight } from './foldRight';

describe('foldRight', () => {
    const stringParser = create<string>((input: string) => {
        if (input.length === 0) {
            return failure();
        }

        return success(input[0], input.slice(1));
    });

    it('should fold right over parsed items', () => {
        const parser = foldRight(
            stringParser,
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertSuccess<string>(result, '(((ZC)B)A)', '');
    });

    it('should work with empty input (return initial value and not consume input)', () => {
        const parser = foldRight(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertSuccess<string>(result, 'Z', 'ABC');
    });

    it('should work with empty input (return initial value)', () => {
        const parser = foldRight(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('');

        assertSuccess<string>(result, 'Z', '');
    });

    it('should work with complex accumulator types', () => {
        const parser = foldRight(
            stringParser,
            { label: '', count: 0 },
            (acc, label) => ({
                label: acc.label + label,
                count: acc.count + 1,
            }),
        );
        const result = parser('CBA');

        assertSuccess<{
            label: string;
            count: number;
        }>(result, { label: 'ABC', count: 3 }, '');
    });

    it('should work with array building', () => {
        const parser = foldRight(stringParser, [] as string[], (acc, digit) => [
            ...acc,
            digit + 'Z',
        ]);
        const result = parser('ABC');

        assertSuccess<string[]>(result, ['CZ', 'BZ', 'AZ'], '');
    });

    it('should not fail and return the initial value and not consume', () => {
        const parserFail = create(() => failure());
        const parser = foldRight(parserFail, 0, (acc) => acc + 1);
        const result = parser('ABC');

        assertSuccess<number>(result, 0, 'ABC');
    });
});
