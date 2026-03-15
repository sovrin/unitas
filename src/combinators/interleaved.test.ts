import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { interleaved } from './interleaved';

describe('interleaved', () => {
    it('should parse alternating items and separators', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('ABABA');

        assertSuccess<('A' | 'B')[]>(result, ['A', 'B', 'A', 'B', 'A'], '');
    });

    it('should handle single item', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('AC');

        assertSuccess<('A' | 'B')[]>(result, ['A'], 'C');
    });

    it('should fail when first item does not match', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('CC');

        assertFailure<('A' | 'B')[]>(result);
    });

    it('should stop when separator has no following item', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = interleaved(parser1, parser2);
        const result = parser('ABABC');

        assertSuccess<('A' | 'B')[]>(result, ['A', 'B', 'A'], 'BC');
    });
});
