import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { takeUntil } from './takeUntil';

describe('takeUntil', () => {
    it('should take characters until predicate is true', () => {
        const parser = takeUntil((c) => c === 'B');
        const result = parser('ABC');

        assertSuccess<string>(result, 'A', 'BC');
    });

    it('should take all characters when predicate never true', () => {
        const parser = takeUntil((c) => c === 'D');
        const result = parser('ABC');

        assertSuccess<string>(result, 'ABC', '');
    });

    it('should return empty string when first character satisfies predicate', () => {
        const parser = takeUntil((c) => c === 'A');
        const result = parser('ABC');

        assertSuccess<string>(result, '', 'ABC');
    });

    it('should handle empty input', () => {
        const parser = takeUntil(() => true);
        const result = parser('');

        assertSuccess<string>(result, '', '');
    });
});
