import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { separatedUntil } from './separatedUntil';

describe('separatedUntil', () => {
    it('should parse separated elements followed by terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser3 = createTestParser(';');

        const parser = separatedUntil(parser1, parser2, parser3);
        const result = parser('A,A,A;');

        assertSuccess<'A'[]>(result, ['A', 'A', 'A'], '');
    });

    it('should handle single element with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser3 = createTestParser(';');

        const parser = separatedUntil(parser1, parser2, parser3);
        const result = parser('A;');

        assertSuccess<'A'[]>(result, ['A'], '');
    });

    it('should handle empty list with terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser3 = createTestParser(';');

        const parser = separatedUntil(parser1, parser2, parser3);
        const result = parser(';');

        assertSuccess<'A'[]>(result, [], '');
    });

    it('should fail without terminator', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser3 = createTestParser(';');

        const parser = separatedUntil(parser1, parser2, parser3);
        const result = parser('A,A,A');

        assertFailure<'A'[]>(result);
    });

    it('should fail on parser fail', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser(',');
        const parser3 = createTestParser(';');

        const parser = separatedUntil(parser1, parser2, parser3);
        const result = parser('A,A,B;');

        assertFailure<'A'[]>(result);
    });
});
