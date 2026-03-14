import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { optionalWith } from './optionalWith';

describe('optionalWith', () => {
    const parserA = createTestParser('A');

    it('should return default value when parser fails', () => {
        const parser = optionalWith(parserA, 'default');
        const result = parser('BCD');

        assertResult<'A' | 'default'>(result, ['default', 'BCD']);
    });

    it('should not consume input when parser fails', () => {
        const parserFail = create<'A'>(() => failure());
        const parser = optionalWith(parserFail, 'world');
        const result = parser('goodbye');

        assertResult<'A' | 'world'>(result, ['world', 'goodbye']);
    });

    it('should handle empty input', () => {
        const parser = optionalWith(parserA, 'empty');
        const result = parser('');

        assertResult<'A' | 'empty'>(result, ['empty', '']);
    });

    it('should work with complex default values', () => {
        const parser1 = create<string>(() => failure());
        const parser = optionalWith<
            { default: boolean; value: number } | string
        >(parser1, {
            default: true,
            value: 42,
        });
        const result = parser('y');

        assertResult<{ default: boolean; value: number } | string>(result, [
            { default: true, value: 42 },
            'y',
        ]);
    });

    it('should return parsed value when parser succeeds', () => {
        const parser = optionalWith(parserA, 'default');
        const result = parser('ABCD');

        assertResult<'A' | 'default'>(result, ['A', 'BCD']);
    });
});
