import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { until } from './until';

describe('until', () => {
    const aParser = createTestParser('A');
    const bParser = createTestParser('B');

    it('should parse items until terminator is found', () => {
        const parser = until(aParser, bParser);
        const result = parser('AAAABAAAA');

        assertResult<'A'[]>(result, [['A', 'A', 'A', 'A'], 'BAAAA']);
    });

    it('should return empty array when terminator is at start', () => {
        const failureParser = create(() => failure());
        const parser = until(failureParser, bParser);
        const result = parser('BAAAA');

        assertResult<unknown[]>(result, [[], 'BAAAA']);
    });

    it('should fail when terminator is never found and parser fails', () => {
        const parser = until(aParser, bParser);
        const result = parser('AAAA');

        assertResult<'A'[]>(result);
    });
});
