import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { padded } from './padded';

describe('padded', () => {
    it('should parse content with padding on both sides', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('  A  ');

        assertSuccess<'A'>(result, 'A', '');
    });

    it('should parse content with no padding', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('A');

        assertSuccess<'A'>(result, 'A', '');
    });

    it('should parse content with padding on left only', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('  A');

        assertSuccess<'A'>(result, 'A', '');
    });

    it('should parse content with padding on right only', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('A  ');

        assertSuccess<'A'>(result, 'A', '');
    });

    it('should fail if content fails', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('  B  ');

        assertFailure<'A'>(result);
    });

    it('should leave remaining input', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('  A  B');

        assertSuccess<'A'>(result, 'A', 'B');
    });

    it('should handle multiple whitespace characters', () => {
        const parser = createTestParser('A');
        const result = padded(parser)('\t\n  A  \r\n');

        assertSuccess<'A'>(result, 'A', '');
    });
});
