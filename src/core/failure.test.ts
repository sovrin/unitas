import { describe, expect, it } from 'vitest';

import { context } from './context';
import { failure } from './failure';

describe('failure', () => {
    it('should create failed parse result at an offset', () => {
        const result = failure(undefined, 3);

        expect(result).toEqual({ ok: false, index: 3, expected: [] });
    });

    it('should record what was expected at that offset', () => {
        const result = failure(undefined, 3, 'digit', 'letter');

        expect(result.expected).toEqual(['digit', 'letter']);
    });

    it('should note the failure in the parse context', () => {
        const ctx = context();
        failure(ctx, 3, 'digit');

        expect(ctx).toEqual({ furthest: 3, expected: ['digit'] });
    });
});
