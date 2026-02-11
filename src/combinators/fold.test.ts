import { describe, it } from 'vitest';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { fold } from './fold';
import { assertResult } from '../../test/utils.test';

describe('fold', () => {
    const parser1 = create<string>((input: string) => {
        if (input.length === 0) {
            return failure();
        }
        return success(input[0], input.slice(1));
    });

    it('should fold left over parsed items', () => {
        const parser = fold(parser1, 'Z', (acc, item) => `(${acc}${item})`);
        const result = parser('ABC');

        assertResult<string>(result, ['(((ZA)B)C)', '']);
    });

    it('should work with empty input (return initial value and not consume input)', () => {
        const parser = fold(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('ABC');

        assertResult<string>(result, ['Z', 'ABC']);
    });

    it('should work with empty input (return initial value)', () => {
        const parser = fold(
            create<string>(() => failure()),
            'Z',
            (acc, item) => `(${acc}${item})`,
        );
        const result = parser('');

        assertResult<string>(result, ['Z', '']);
    });

    it('should work with complex accumulator types', () => {
        const parser = fold(parser1, { label: '', count: 0 }, (acc, label) => ({
            label: acc.label + label,
            count: acc.count + 1,
        }));
        const result = parser('ABC');

        assertResult<{
            label: string;
            count: number;
        }>(result, [{ label: 'ABC', count: 3 }, '']);
    });

    it('should work with array building', () => {
        const parser = fold(parser1, [] as string[], (acc, digit) => [
            ...acc,
            digit + 'Z',
        ]);
        const result = parser('ABC');

        assertResult<string[]>(result, [['AZ', 'BZ', 'CZ'], '']);
    });

    it('should not fail and return the initial value and not consume', () => {
        const parser1 = create(() => failure());
        const parser = fold(parser1, 0, (acc) => acc + 1);
        const result = parser('ABC');

        assertResult<number>(result, [0, 'ABC']);
    });
});
