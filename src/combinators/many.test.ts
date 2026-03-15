import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { many } from './many';

describe('many', () => {
    it('should parse zero occurrences', () => {
        const failureParser = create(() => failure());
        const parser = many(failureParser);
        const result = parser('BCD');

        assertSuccess<unknown[]>(result, [], 'BCD');
    });

    it('should parse one occurrence', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('ABCD');

        assertSuccess<'A'[]>(result, ['A'], 'BCD');
    });

    it('should parse multiple occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('AAABCD');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], 'BCD');
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = many(parser1);
        const result = parser('');

        assertSuccess<'A'[]>(result, [], '');
    });

    it('should prevent infinite loops with non-consuming parsers', () => {
        const nonConsumingParser = () => ['', 'AB'] as [string, string];
        const parser = many(nonConsumingParser as any);
        const result = parser('AB');

        assertSuccess<unknown[]>(result, [], 'AB');
    });
});
