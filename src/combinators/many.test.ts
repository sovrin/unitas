import { describe, expect, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { many } from './many';

describe('many', () => {
    it('should parse zero occurrences', () => {
        const failureParser = create((_input, index = 0) =>
            failure(undefined, index),
        );
        const parser = many(failureParser);
        const result = parser('BCD');

        assertSuccess<unknown[]>(result, [], 0);
    });

    it('should parse one occurrence', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('ABCD');

        assertSuccess<'A'[]>(result, ['A'], 1);
    });

    it('should parse multiple occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 3);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('');

        assertSuccess<'A'[]>(result, [], 0);
    });

    it('should prevent infinite loops with non-consuming parsers', () => {
        const nonConsumingParser = create<string>((_input, index = 0) =>
            success('', index),
        );
        const parser = many(nonConsumingParser);
        const result = parser('AB');

        assertSuccess<unknown[]>(result, [], 0);
    });

    it('should stop after partial progress when parser later stalls', () => {
        let callCount = 0;
        const partiallyConsumingParser = create((input, index = 0) => {
            callCount++;
            if (input.startsWith('A', index)) {
                return success('A', index + 1);
            }

            return success('X', index);
        });

        const parser = many(partiallyConsumingParser);
        const result = parser('ABCD');

        assertSuccess(result, ['A'], 1);
        expect(callCount).toBe(2);
    });
});
