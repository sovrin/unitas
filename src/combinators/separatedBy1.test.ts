import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { separatedBy1 } from './separatedBy1';

describe('separatedBy1', () => {
    it('should require at least one element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy1(parser1, parser2);
        const result = parser('BBB');

        assertFailure<'A'[]>(result);
    });

    it('should parse single element', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy1(parser1, parser2);
        const result = parser('ABC');

        assertSuccess<'A'[]>(result, ['A'], 'BC');
    });

    it('should parse multiple elements', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy1(parser1, parser2);
        const result = parser('A,A,A,A');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A', 'A'], '');
    });

    it('should handle trailing separator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy1(parser1, parser2);
        const result = parser('A,A,A,A,');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A', 'A'], ',');
    });

    it('should fail on empty input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');

        const parser = separatedBy1(parser1, parser2);
        const result = parser('');

        assertFailure<'A'[]>(result);
    });
});
