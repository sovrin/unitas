import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { until } from './until';

describe('until', () => {
    const aParser = createTestParser('A');
    const bParser = createTestParser('B');

    it('should parse items until terminator is found', () => {
        const parser = until(aParser, bParser);
        const result = parser('AAAABAAAA');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A', 'A'], 4);
    });

    it('should return empty array when terminator is at start', () => {
        const failureParser = create((_input, index = 0) => failure(index));
        const parser = until(failureParser, bParser);
        const result = parser('BAAAA');

        assertSuccess<unknown[]>(result, [], 0);
    });

    it('should fail when terminator is never found and parser fails', () => {
        const parser = until(aParser, bParser);
        const result = parser('AAAA');

        assertFailure<'A'[]>(result);
    });
});
