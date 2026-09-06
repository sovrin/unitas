import { describe, expect, it } from 'vitest';

import { failure } from './failure';

describe('failure', () => {
    it('should create failed parse result at an offset', () => {
        const result = failure(3);

        expect(result).toEqual({
            ok: false,
            index: 3,
            furthest: 3,
            expected: [],
        });
    });

    it('should record what was expected at that offset', () => {
        const result = failure(3, 'digit', 'letter');

        expect(result.expected).toEqual(['digit', 'letter']);
    });
});
