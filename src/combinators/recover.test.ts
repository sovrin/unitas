import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { recover } from './recover';

describe('recover', () => {
    const parserA = createTestParser('A');

    it('should return default value when parser fails', () => {
        const parser = recover(parserA, 'default');
        const result = parser('BCD');

        assertSuccess<'A' | 'default'>(result, 'default', 0);
    });

    it('should not consume input when parser fails', () => {
        const parserFail = create<'A'>((_input, index = 0) =>
            failure(undefined, index),
        );
        const parser = recover(parserFail, 'world');
        const result = parser('goodbye');

        assertSuccess<'A' | 'world'>(result, 'world', 0);
    });

    it('should handle empty input', () => {
        const parser = recover(parserA, 'empty');
        const result = parser('');

        assertSuccess<'A' | 'empty'>(result, 'empty', 0);
    });

    it('should work with complex default values', () => {
        const parser1 = create<string>((_input, index = 0) =>
            failure(undefined, index),
        );
        const parser = recover<{ default: boolean; value: number } | string>(
            parser1,
            {
                default: true,
                value: 42,
            },
        );
        const result = parser('y');

        assertSuccess<{ default: boolean; value: number } | string>(
            result,
            { default: true, value: 42 },
            0,
        );
    });

    it('should return parsed value when parser succeeds', () => {
        const parser = recover(parserA, 'default');
        const result = parser('ABCD');

        assertSuccess<'A' | 'default'>(result, 'A', 1);
    });
});
